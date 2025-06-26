// DashboardDescription.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import CorrelationImg from '../../assets/CorrelationMatrixHeatmap.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardDescription = () => {
    const [admin, setAdmin] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [dataStats, setDataStats] = useState({ rows: 0, columns: 0, missing: 0, outliers: 0 });
    const [data, setData] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState("totChol");

    const categorical = ["male", "currentSmoker", "diabetes", "BPMeds"];
    const numeric = ["age", "cigsPerDay", "sysBP", "diaBP", "BMI", "glucose", "totChol", "heartRate"];
    const allColumns = [...categorical, ...numeric];

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("https://bp-prediction-backend.onrender.com/api/predictions/stats");
                setDataStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        axios.get("https://bp-prediction-backend.onrender.com/api/hypertension/all").then((res) => {
            setData(res.data);
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios.get("https://bp-prediction-backend.onrender.com/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => setAdmin(res.data))
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const getCounts = (col) => {
        const counts = {};
        const labelMap = {
            male: { 0: "Female", 1: "Male" },
            currentSmoker: { 0: "Non-Smoker", 1: "Smoker" },
            diabetes: { 0: "No", 1: "Yes" },
            BPMeds: { 0: "No Meds", 1: "On Meds" },
        };

        data.forEach((row) => {
            let val = row[col] ?? "Unknown";
            if (labelMap[col]) val = labelMap[col][val] ?? val;
            val = String(val);
            counts[val] = (counts[val] || 0) + 1;
        });
        return counts;
    };


    const getHistogram = (col, binCount = 10) => {
        const values = data.map((row) => parseFloat(row[col])).filter((v) => !isNaN(v));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const step = (max - min) / binCount;
        const bins = new Array(binCount).fill(0);
        values.forEach(val => {
            const index = Math.min(Math.floor((val - min) / step), binCount - 1);
            bins[index]++;
        });
        return {
            labels: bins.map((_, i) => `${(min + i * step).toFixed(1)}–${(min + (i + 1) * step).toFixed(1)}`),
            values: bins,
        };
    };

    const renderChart = () => {
        const isNumeric = numeric.includes(selectedColumn);
        const { labels, values } = isNumeric
            ? getHistogram(selectedColumn)
            : (() => {
                const counts = getCounts(selectedColumn);
                return { labels: Object.keys(counts), values: Object.values(counts) };
            })();

        const colors = labels.map(() =>
            `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
        );

        return (
            <div className="overflow-x-auto" style={{ height: "500px" }}>
                <Bar
                    data={{
                        labels,
                        datasets: [{
                            label: "Data Distribution",
                            data: values,
                            backgroundColor: colors,
                        }],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            datalabels: {
                                display: true,
                                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                                anchor: 'end',
                                align: 'end',
                                font: {
                                    weight: 'bold',
                                    size: 20,
                                },
                                formatter: (value) => value,
                            },
                            legend: {
                                labels: {
                                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000', // Set legend text color
                                    font: {
                                        weight: 'bold',
                                        size: 18,
                                    },
                                },
                            },
                            tooltip: {
                                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',// Set x-axis tick color
                                    font: {
                                        size: 18,
                                    },
                                },
                            },
                            y: {
                                ticks: {
                                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',// Set y-axis tick color
                                    font: {
                                        size: 18,
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        );
    };




    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white md:ml-64 transition-colors duration-300 text-2xl">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 shadow-md">
                <h1 className="text-2xl font-bold text-primary">Description Our Dataset</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600 transition"
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <Moon className="text-gray-800 dark:text-white w-6 h-6" />
                        ) : (
                            <Sun className="text-yellow-400 w-6 h-6" />
                        )}
                    </button>

                    <div className="flex items-center justify-between border border-primary rounded-full px-1 py-1 w-fit">
                        <div className=" text-left mr-4 ml-2">
                            <div className="text-sm font-bold">{admin.username?.split(" ")[0]}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-300">Admin</div>
                        </div>
                        <img
                            src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border"
                        />
                    </div>
                </div>
            </header>

            <main className="bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 text-black dark:text-white p-6">
                <p className="mb-6  leading-relaxed">
                    This dataset, sourced from Kaggle, contains structured data with multiple rows and columns representing various features. It includes both numerical and categorical variables, allowing for basic statistical analysis and visualization. Key metrics such as totals, averages, and missing values have been identified to understand the data quality and structure. This dataset is suitable for exploratory data analysis and building predictive models depending on the objective.
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Total Rows", value: 4240 },
                        { label: "Total Columns", value: 13 },
                        { label: "Total Missing", value: 540 },
                        { label: "Total Outlier", value: 993 },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow text-center">
                            <p className="text-primary text-2xl font-bold">{stat.value}</p>
                            <p className="font-semibold  text-neutral-700 dark:text-neutral-300">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="">
                    {/* Distribution Chart */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow text-center ">
                        <h2 className="text-3xl font-bold mb-4">Data Distribution</h2>
                        <div className="flex  mb-4">
                            <select
                                className={`border p-2 rounded w-full transition ${darkMode ? "bg-neutral-700 text-white border-neutral-600" : "bg-white text-black border-neutral-300"
                                    }`}
                                value={selectedColumn}
                                onChange={(e) => setSelectedColumn(e.target.value)}
                            >
                                {allColumns.map((col) => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                        {renderChart()}
                    </div>

                    {/* Correlation Heatmap */}
                    <div className="bg-white mt-3 dark:bg-neutral-800 rounded-lg p-4 shadow text-center ">
                        <h2 className="text-3xl font-bold mb-4">Correlation Heatmap</h2>
                        <img src={CorrelationImg} alt="Correlation Heatmap" className="w-full rounded" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardDescription;
