// AdminSystemReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sun, Moon, BarChart2, UserPlus, Users } from "lucide-react";

const AdminSystemReport = () => {
    const [overview, setOverview] = useState({});
    const [dailyReport, setDailyReport] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState([]);
    const [filteredMonthlyReport, setFilteredMonthlyReport] = useState([]);
    const [admin, setAdmin] = useState({});
    const [darkMode, setDarkMode] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterColumn, setFilterColumn] = useState("");
    const [filterValue, setFilterValue] = useState("");

    const [dailyPage, setDailyPage] = useState(1);
    const [monthlyPage, setMonthlyPage] = useState(1);
    const rowsPerPage = 10;

    const months = Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, i))
    );

    const createRanges = (ranges) =>
        ranges.map(([min, max]) => ({
            label: max === Infinity ? `${min}+` : `${min}-${max}`,
            min,
            max,
        }));

    const ageRanges = createRanges([
        [0, 10], [10, 20], [20, 30], [30, 40], [40, 50],
        [50, 60], [60, 70], [70, 80], [80, 90], [90, 100]
    ]);

    const sysBPRanges = createRanges([[80, 100], [100, 120], [120, 140], [140, Infinity]]);
    const diaBPRanges = createRanges([[60, 70], [70, 80], [80, 90], [90, Infinity]]);
    const BMIRanges = [
        { label: "Underweight (<18.5)", min: 0, max: 18.5 },
        { label: "Normal (18.5–24.9)", min: 18.5, max: 24.9 },
        { label: "Overweight (25+)", min: 25, max: Infinity },
    ];
    const glucoseRanges = createRanges([[70, 90], [90, 110], [110, 130], [130, Infinity]]);
    const totCholRanges = createRanges([[100, 150], [150, 200], [200, Infinity]]);
    const heartRateRanges = createRanges([[50, 70], [70, 90], [90, Infinity]]);

    const getRangeLabel = (value, ranges) => {
        const range = ranges.find(r => value >= r.min && value < r.max);
        return range ? range.label : value;
    };

    const rangeMap = {
        age: ageRanges,
        sysBP: sysBPRanges,
        diaBP: diaBPRanges,
        BMI: BMIRanges,
        glucose: glucoseRanges,
        totChol: totCholRanges,
        heartRate: heartRateRanges,
        currentSmoker: [
            { label: "Smoker", min: 1, max: 2 },
            { label: "Non-Smoker", min: 0, max: 1 },
        ],
        diabetes: [
            { label: "Diabetic", min: 1, max: 2 },
            { label: "Non-Diabetic", min: 0, max: 1 },
        ],
        BPMeds: [
            { label: "Yes", min: 1, max: 2 },
            { label: "No", min: 0, max: 1 },
        ],
        male: [
            { label: "Male", min: 1, max: 2 },
            { label: "Female", min: 0, max: 1 },
        ],
        prediction: [
            { label: "Risk", min: 1, max: 2 },
            { label: "No Risk", min: 0, max: 1 },
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewRes, dailyRes, monthlyRes] = await Promise.all([
                    axios.get("https://bp-prediction-backend.onrender.com/api/report/overview"),
                    axios.get("https://bp-prediction-backend.onrender.com/api/report/predictions/daily"),
                    axios.get("https://bp-prediction-backend.onrender.com/api/report/predictions/monthly"),
                ]);

                setOverview(overviewRes.data);
                setDailyReport(dailyRes.data);
                setMonthlyReport(monthlyRes.data);
            } catch (error) {
                console.error("Error loading report data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("https://bp-prediction-backend.onrender.com/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setAdmin(res.data))
            .catch((err) => console.error("Error loading profile", err));
    }, []);

    useEffect(() => {
        const filtered = monthlyReport.filter((item) => {
            const created = new Date(item.createdAt);
            const matchesMonth = created.getMonth() + 1 === Number(selectedMonth);
            const matchesSearch = item.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesFilter = true;
            if (filterColumn && filterValue !== "") {
                const selectedRanges = rangeMap[filterColumn];
                if (selectedRanges) {
                    const selected = selectedRanges.find(r => r.label === filterValue);
                    if (selected) {
                        matchesFilter = item[filterColumn] >= selected.min && item[filterColumn] < selected.max;
                    }
                } else {
                    matchesFilter = String(item[filterColumn]) === filterValue;
                }
            }

            return matchesMonth && matchesSearch && matchesFilter;
        });

        setFilteredMonthlyReport(filtered);
    }, [monthlyReport, selectedMonth, searchTerm, filterColumn, filterValue]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const paginatedDaily = dailyReport.slice((dailyPage - 1) * rowsPerPage, dailyPage * rowsPerPage);
    const paginatedMonthly = filteredMonthlyReport.slice((monthlyPage - 1) * rowsPerPage, monthlyPage * rowsPerPage);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-black dark:text-white md:ml-64 transition-colors duration-300 text-2xl">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 shadow-md">
                <h1 className="text-2xl font-bold text-primary">Report</h1>
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
                            src={`https://bp-prediction-backend.onrender.com/uploads/${admin.profilePicture || "default.png"}`}
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border"
                        />
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-600 text-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <h3 className=" font-medium">Daily Predictions</h3>
                            <p className="text-2xl font-bold">{overview.dailyPredictions}</p>
                        </div>
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <div className="bg-blue-600 text-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <h3 className=" font-medium">Monthly Predictions</h3>
                            <p className="text-2xl font-bold">{overview.monthlyPredictions}</p>
                        </div>
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <div className="bg-green-700 text-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <h3 className=" font-medium">Daily Users</h3>
                            <p className="text-2xl font-bold">{overview.dailyUsers}</p>
                        </div>
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div className="bg-green-700 text-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                            <h3 className=" font-medium">Monthly Users</h3>
                            <p className="text-2xl font-bold">{overview.monthlyUsers}</p>
                        </div>
                        <Users className="w-8 h-8" />
                    </div>
                </div>

                {/* <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Daily Prediction Report</h2>
                    <table className="min-w-full bg-white dark:bg-neutral-800 shadow rounded">
                        <thead className="bg-gray-200 dark:bg-neutral-700">
                            <tr>
                                <th className="text-left py-2 px-4">User</th>
                                <th className="text-left py-2 px-4">Age</th>
                                <th className="text-left py-2 px-4">BP (sys/dia)</th>
                                <th className="text-left py-2 px-4">Prediction</th>
                                <th className="text-left py-2 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyReport.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 dark:border-gray-600">
                                    <td className="py-2 px-4">{item.userId?.username || "-"}</td>
                                    <td className="py-2 px-4">{item.age}</td>
                                    <td className="py-2 px-4">{item.sysBP}/{item.diaBP}</td>
                                    <td className="py-2 px-4">{item.prediction === 1 ? "High Risk" : "Low Risk"}</td>
                                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}


                {/* Daily Report Table */}
                <section className="p-4">
                    <h2 className="text-xl font-semibold mb-2">Daily Predictions</h2>
                    <table className="w-full text-left ">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-neutral-800">
                                <th className="py-2 px-4">#</th>
                                <th className="py-2 px-4">User</th>
                                <th className="py-2 px-4">Age</th>
                                <th className="py-2 px-4">BP (sys/dia)</th>
                                <th className="py-2 px-4">Prediction</th>
                                <th className="py-2 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDaily.map((item, index) => (
                                <tr key={index} className="border-b dark:border-neutral-700">
                                    <td className="py-2 px-4">{(dailyPage - 1) * rowsPerPage + index + 1}</td>
                                    <td className="py-2 px-4">{item.userId?.username || '-'}</td>
                                    <td className="py-2 px-4">{item.age}</td>
                                    <td className="py-2 px-4">{item.sysBP}/{item.diaBP}</td>
                                    <td className="py-2 px-4">{item.prediction === 1 ? 'High Risk' : 'Low Risk'}</td>
                                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end items-center gap-4 mt-3">
                        <button onClick={() => setDailyPage(p => Math.max(p - 1, 1))} disabled={dailyPage === 1} className="px-3 py-1 border rounded">Previous</button>
                        <span>Page {dailyPage}</span>
                        <button onClick={() => setDailyPage(p => p + 1)} disabled={dailyPage * rowsPerPage >= dailyReport.length} className="px-3 py-1 border rounded">Next</button>
                    </div>
                </section>

                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Monthly Prediction Report</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 rounded border border-gray-300 dark:bg-neutral-700 dark:text-white"
                            />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="p-2 rounded border border-gray-300 dark:bg-neutral-700 dark:text-white"
                            >
                                {months.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={filterColumn}
                                onChange={(e) => {
                                    setFilterColumn(e.target.value);
                                    setFilterValue("");
                                }}
                                className="p-2 rounded border border-gray-300 dark:bg-neutral-700 dark:text-white"
                            >
                                <option value="">Select Column</option>
                                {Object.keys(rangeMap).map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                            {filterColumn && rangeMap[filterColumn] && (
                                <select
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    className="p-2 rounded border border-gray-300 dark:bg-neutral-700 dark:text-white"
                                >
                                    <option value="">Select Value</option>
                                    {rangeMap[filterColumn].map((range) => (
                                        <option key={range.label} value={range.label}>{range.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {/* <table className="min-w-full bg-white dark:bg-neutral-800 shadow rounded">
                            <thead className="bg-gray-200 dark:bg-neutral-700">
                                <tr>
                                    <th className="text-left py-2 px-4">No.</th>
                                    <th className="text-left py-2 px-4">User</th>
                                    {filterColumn && <th className="text-left py-2 px-4">{filterColumn}</th>}
                                    <th className="text-left py-2 px-4">Prediction</th>
                                    <th className="text-left py-2 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMonthlyReport.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-600">
                                        <td className="py-2 px-4">{idx + 1}</td>
                                        <td className="py-2 px-4">{item.userId?.username || '-'}</td>
                                        {filterColumn && (
                                            <td className="py-2 px-4">{item[filterColumn]}</td>
                                        )}
                                        <td className="py-2 px-4">{item.prediction === 1 ? ' Risk' : 'No Risk'}</td>
                                        <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}

                        <table className="w-full text-left ">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-neutral-800">
                                    <th className="py-2 px-4">#</th>
                                    <th className="py-2 px-4">User</th>
                                    {filterColumn && filterColumn !== "prediction" && (
                                        <th className="py-2 px-4 capitalize">{filterColumn}</th>
                                    )}
                                    <th className="py-2 px-4">Prediction</th>
                                    <th className="py-2 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMonthly.map((item, index) => (
                                    <tr key={index} className="border-b dark:border-neutral-700">
                                        <td className="py-2 px-4">{(monthlyPage - 1) * rowsPerPage + index + 1}</td>
                                        <td className="py-2 px-4">{item.userId?.username || '-'}</td>
                                        {filterColumn && filterColumn !== "prediction" && (
                                            <td className="py-2 px-4">
                                                {item[filterColumn]}
                                            </td>
                                        )}
                                        <td className="py-2 px-4">{item.prediction === 1 ? 'Risk' : 'No Risk'}</td>
                                        <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end items-center gap-4 mt-3">
                            <button onClick={() => setMonthlyPage(p => Math.max(p - 1, 1))} disabled={monthlyPage === 1} className="px-3 py-1 border rounded">Previous</button>
                            <span>Page {monthlyPage}</span>
                            <button onClick={() => setMonthlyPage(p => p + 1)} disabled={monthlyPage * rowsPerPage >= filteredMonthlyReport.length} className="px-3 py-1 border rounded">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSystemReport;
