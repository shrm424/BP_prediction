import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Moon, Sun } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Corrected import

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function SystemChart() {
    const [charts, setCharts] = useState([]);
    const [admin, setAdmin] = useState({});
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedAdmin = JSON.parse(localStorage.getItem("admin"));
        if (storedAdmin) setAdmin(storedAdmin);
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/predictions/stats");
            const data = res.data;

            const preparedCharts = [
                {
                    title: "Prediction Results",
                    labels: ["High Risk", "Low Risk"],
                    values: [data.highRisk, data.lowRisk],
                    colors: ["#EF4444", "#10B981"]
                },
                {
                    title: "Gender",
                    labels: ["Male", "Female"],
                    values: [data.male, data.female],
                    colors: ["#3B82F6", "#EC4899"]
                },
                {
                    title: "Smoking Status",
                    labels: ["Smokers", "Non-Smokers"],
                    values: [data.smokers, data.nonSmokers],
                    colors: ["#F59E0B", "#22C55E"]
                },
                {
                    title: "Averages",
                    labels: ["Age", "BMI", "Glucose", "Heart Rate"],
                    values: [data.avgAge, data.avgBMI, data.avgGlucose, data.avgHeartRate],
                    colors: ["#6366F1"]
                }
            ];

            setCharts(preparedCharts);
        } catch (err) {
            console.error("Error fetching prediction stats:", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("http://localhost:5000/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAdmin(res.data))
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    if (!charts.length) return <main className="ml-64 p-6">Loading Charts...</main>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 text-black dark:text-white md:ml-64 text-2xl">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 shadow-md">
                <h1 className="font-bold text-primary">System Chart</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-gray-600 transition"
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <Sun className="text-yellow-400 w-6 h-6" />
                        ) : (
                            <Moon className="text-gray-800 dark:text-white w-6 h-6" />
                        )}
                    </button>
                    <div className="flex items-center justify-between border border-primary rounded-full px-1 py-1 w-fit">
                        <div className=" text-left mr-4 ml-2">
                            <div className="text-sm font-bold">{admin.username?.split(" ")[0]}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">Admin</div>
                        </div>
                        <img
                            src={`http://localhost:5000/uploads/${admin.profilePicture || "default.png"}`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border"
                        />
                    </div>
                </div>
            </header>

            {/* Filters */}
            <main className="p-6">
                {/* Chart Sections */}
                {charts.map((chart, index) => (
                    <section
                        key={index}
                        className="bg-white dark:bg-neutral-800 p-6 mb-6 rounded-xl shadow-md"
                    >
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                            {chart.title}
                        </h2>
                        <Bar
                            data={{
                                labels: chart.labels,
                                datasets: [
                                    {
                                        label: chart.title,
                                        data: chart.values,
                                        backgroundColor: chart.colors,
                                        borderRadius: 6,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    datalabels: {
                                        display: true,
                                        color: darkMode ? '#000' : '#fff', // Adjust label color based on dark mode
                                        anchor: 'end',
                                        align: 'end',
                                        font: {
                                            weight: 'bold',
                                            size: 20
                                        },
                                        formatter: (value) => value, // Display the actual value/count on top of the bars
                                    },
                                    legend: {
                                        labels: {
                                            color: darkMode ? "#000" : "#fff", // Set legend text color
                                            font: {
                                                weight: "bold",
                                                size: 18,
                                            },
                                        },
                                    },
                                    tooltip: {
                                        bodyColor: darkMode ? "#000" : "#fff", // Set tooltip text color
                                        titleColor: darkMode ? "#000" : "#fff", // Set tooltip title color
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: darkMode ? '#000' : '#fff', // Set x-axis tick color
                                            font: {
                                                size: 18,
                                            },
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            color: darkMode ? '#000' : '#fff', // Set y-axis tick color
                                            font: {
                                                size: 18,
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </section>
                ))}
            </main>

        </div>
    );
}
