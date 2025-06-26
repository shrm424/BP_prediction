// Import necessary libraries and components
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Pie } from "react-chartjs-2";
import { Sun, Moon, Users, BarChart3, Activity, AlertTriangle } from "lucide-react";

// Register chart components and plugins
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [predictions, setPredictions] = useState(0);
  const [data, setData] = useState({ risk: 0, no_risk: 0, total: 0 });
  const [admin, setAdmin] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error("Error loading profile", err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/total-users");
        setUserCount(userRes.data.total);

        const predictionRes = await axios.get("http://localhost:5000/api/total-predictions");
        setPredictions(predictionRes.data.t_prediction);

        const classifiedRes = await axios.get("http://localhost:5000/api/classified-predictions");
        setData(classifiedRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const barChartData = {
    labels: ["Total", "Risk", "No Risk"],
    datasets: [
      {
        label: "Predictions",
        data: [data.total, data.risk, data.no_risk],
        backgroundColor: ["#6366f1", "#ef4444", "#10b981"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Risk", "No Risk"],
    datasets: [
      {
        data: [data.risk, data.no_risk],
        backgroundColor: ["#ef4444", "#10b981"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-black dark:text-white md:ml-64 transition-colors duration-300 text-2xl">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 shadow-md">
        <h1 className=" font-bold text-primary">Dashboard</h1>
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
            <div className="text-left mr-4 ml-2">
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

      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[{
            label: "Total Users", value: userCount, Icon: Users
          }, {
            label: "Total Predictions", value: predictions, Icon: BarChart3
          }, {
            label: "Total Risk Predictions", value: data.risk, Icon: AlertTriangle
          }, {
            label: "Total No Risk Predictions", value: data.no_risk, Icon: Activity
          }].map(({ label, value, Icon }, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-800 shadow rounded-lg p-4 text-center hover:scale-[1.02] transition-transform duration-300">
              <Icon className="w-10 h-10 mx-auto mb-1 text-primary" />
              <p className="text-gray-400">{label}</p>
              <h3 className=" font-bold text-primary dark:text-primary">{value}</h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-neutral-800 shadow rounded p-4">
            <h3 className="font-semibold mb-4 text-center">Prediction Bar Chart</h3>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
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
              plugins={[ChartDataLabels]}
            />
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-neutral-800 shadow rounded p-4">
            <h3 className="font-semibold mb-4 text-center">Risk Distribution Pie Chart</h3>
            <div className="mx-auto w-64 h-64">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        font: { size: 18  , weight: "500" },
                        boxWidth: 20,
                        boxHeight: 12,
                        usePointStyle: true,
                        color: darkMode ? '#000' : '#fff',
                      },
                    },
                    datalabels: {
                      color: darkMode ? '#000' : '#fff',
                      font: {
                        weight: 'bold',
                        size: 20,
                      },
                      formatter: (value, context) => {
                        const label = context.chart.data.labels[context.dataIndex];
                        return `${value}`;
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
