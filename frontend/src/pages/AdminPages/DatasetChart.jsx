import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Moon, Sun } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const TargetDistributionByRisk = () => {
  const [data, setData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("age");
  const [showDistribution, setShowDistribution] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const columns = [
    "age", "cigsPerDay", "sysBP", "diaBP", "BMI", "glucose", "totChol",
    "heartRate", "male", "currentSmoker", "diabetes", "BPMeds"
  ];

  useEffect(() => {
    axios.get("https://bp-prediction-backend.onrender.com/api/hypertension/all")
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  // Readable labels for specific columns
  const readableLabels = (label) => {
    switch (selectedColumn) {
      case 'male':
        return label == 1 ? 'Male' : 'Female';
      case 'currentSmoker':
        return label == 1 ? 'Smoker' : 'Non-Smoker';
      case 'age':
        if (label <= 30) return '<30';
        if (label <= 40) return '30-40';
        if (label <= 50) return '40-50';
        if (label <= 60) return '50-60';
        if (label <= 70) return '60-70';
        if (label <= 80) return '70-80';
        return '80+';
      case 'cigsPerDay':
        if (label <= 0) return '0';
        if (label <= 0) return '1-5';
        if (label <= 5) return '6-10';
        if (label <= 10) return '11-20';
        if (label <= 20) return '21-40';
        if (label <= 40) return '70-80';
        return '41+';
      case 'BPMeds':
        return label == 1 ? 'On Medication' : 'Not on Medication';
      case 'diabetes':
        return label == 1 ? 'Diabetic' : 'Non-Diabetic';
      case 'totChol':
        return label < 200 ? 'Normal (<200)' : (label < 240 ? 'Borderline (200-239)' : 'High (240+)');
      case 'sysBP':
        return label < 90 ? 'Low (<90)' : (label < 140 ? 'Normal (90-139)' : 'High (140+)');
      case 'diaBP':
        return label < 60 ? 'Low (<60)' : (label < 90 ? 'Normal (60-89)' : 'High (90+)');
      case 'heartRate':
        return label < 60 ? 'Low (<60 bpm)' : (label < 100 ? 'Normal (60-100 bpm)' : 'High (>100 bpm)');
      case 'glucose':
        return label < 70 ? 'Low (<70 mg/dL)' : (label < 140 ? 'Normal (70-140 mg/dL)' : 'High (>140 mg/dL)');
      default:
        return label;
    }
  };

  // Helper function to get counts by risk column
  const getCountsRisk = (column) => {
    const counts = {};
    data.forEach((row) => {
      const value = String(row[column] ?? "Unknown");
      const riskValue = String(row["Risk"] ?? "Unknown");
      let valueLabel = '';
      let riskLabel = riskValue === "0" ? "No Risk" : "Risk";

      // Assign the correct label based on column type (numerical or categorical)
      valueLabel = readableLabels(value);

      // Aggregate counts into the risk categories
      if (!counts[valueLabel]) {
        counts[valueLabel] = { "No Risk": 0, "Risk": 0 };
      }
      counts[valueLabel][riskLabel] += 1;
    });
    return counts;
  };

  // Render Bar Chart with stacked bars
  const renderBarChart = (labels, values) => {
    const colors = ['#4caf50', '#f44336'];  // Green for No Risk and Red for Risk
    return (
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "No Risk",
              data: values.map(val => val["No Risk"]),
              backgroundColor: colors[0],
            },
            {
              label: "Risk",
              data: values.map(val => val["Risk"]),
              backgroundColor: colors[1],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                font: {
                  size: 20,  // Font size for legend labels
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.parsed.y}`,
              },
              bodyFont: {
                size: 20, // Font size for tooltip text 
              },
            },
            datalabels: {
              display: true,
              color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
              anchor: 'end',
              align: 'end',
              color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
              font: {
                weight: 'bold',
                size: 20, // Font size for data labels
              },
              formatter: (value) => value,
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (val) => `${val}`,
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                font: {
                  size: 20, // Font size for Y axis ticks
                },
              },
            },
            x: {
              stacked: false,
              ticks: {
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                font: {
                  size: 20, // Font size for X axis ticks
                },
              },
            },
          },
        }}
      />

    );
  };


  const handleShowDistribution = () => {
    setShowDistribution(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <section className="bg-white dark:bg-neutral-900 border border-indigo-200 dark:border-neutral-700 rounded-lg shadow-md p-6 mb-10">
      <h2 className=" font-semibold  text-primary dark:text-white mb-4">Target Distribution by Risk</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md w-full md:w-2/3 bg-white dark:bg-neutral-800 text-black dark:text-white"
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
        <button
          onClick={handleShowDistribution}
          className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow w-full md:w-auto"
        >
          Show
        </button>
      </div>
      {showDistribution && selectedColumn && (() => {
        const counts = getCountsRisk(selectedColumn);  // Get counts by risk category
        const labels = Object.keys(counts);
        const riskCounts = Object.values(counts);

        return renderBarChart(labels, riskCounts);
      })()}
    </section>
  );
};



const GroupedSummary = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({ labels: [], dataset0: [], dataset1: [] });
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [analysisOptions, setAnalysisOptions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    axios.get("https://bp-prediction-backend.onrender.com/api/hypertension/all")
      .then((res) => {
        setData(res.data);
        setAnalysisOptions([
          { label: 'Average Risk by Gender and Smoking Status', value: 'avgRiskByGenderSmoking' },
          { label: 'Average Diastolic BP by Gender and Smoking Status', value: 'avgDiaBPByGenderSmoking' },
          { label: 'Average Risk by Gender and Diabetes Status', value: 'avgRiskByGenderDiabetes' },
          { label: 'Average Risk by Diabetes and BP Medication Status', value: 'avgRiskByDiabetesBPMeds' },
          { label: 'Average Diastolic BP by Diabetes and BP Medication Status', value: 'avgDiaBPByDiabetesBPMeds' },
          { label: 'Average Heart Rate by Gender and Smoking Status', value: 'avgHeartRateByGenderSmoking' },
        ]);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  const labelMapping = (key, val) => {
    const map = {
      male: val === 1 ? 'Male' : 'Female',
      diabetes: val === 1 ? 'Diabetic' : 'No Diabetes',
      BPMeds: val === 1 ? 'On Meds' : 'No Meds',
      currentSmoker: val === 1 ? 'Smoker' : 'Non-Smoker'
    };
    return map[key] || val;
  };

  const groupData = (data, type) => {
    let xKey, groupKey;
    let valueKey;

    switch (type) {
      case 'avgRiskByGenderSmoking':
      case 'avgRiskByGenderDiabetes':
      case 'avgRiskByDiabetesBPMeds':
        valueKey = 'Risk'; break;
      case 'avgDiaBPByGenderSmoking':
      case 'avgDiaBPByDiabetesBPMeds':
        valueKey = 'diaBP'; break;
      case 'avgHeartRateByGenderSmoking':
        valueKey = 'heartRate'; break;
      default: return;
    }

    if (type.includes('Gender') && type.includes('Smoking')) {
      xKey = 'male';
      groupKey = 'currentSmoker';
    } else if (type.includes('Gender') && type.includes('Diabetes')) {
      xKey = 'male';
      groupKey = 'diabetes';
    } else if (type.includes('Diabetes') && type.includes('BP')) {
      xKey = 'diabetes';
      groupKey = 'BPMeds';
    }

    const groups = {};

    data.forEach(item => {
      const xVal = labelMapping(xKey, item[xKey]);
      const groupVal = labelMapping(groupKey, item[groupKey]);
      const key = `${xVal}-${groupVal}`;
      if (!groups[key]) groups[key] = { count: 0, sum: 0 };
      groups[key].count++;
      groups[key].sum += item[valueKey] || 0;
    });

    const xVals = [...new Set(data.map(item => labelMapping(xKey, item[xKey])))];
    const groupVals = [...new Set(data.map(item => labelMapping(groupKey, item[groupKey])))];

    const dataset0 = [], dataset1 = [];

    xVals.forEach(x => {
      const val0 = groups[`${x}-${groupVals[0]}`];
      const val1 = groups[`${x}-${groupVals[1]}`];
      dataset0.push(val0 ? (val0.sum / val0.count).toFixed(2) : null);
      dataset1.push(val1 ? (val1.sum / val1.count).toFixed(2) : null);
    });

    setGroupedData({ labels: xVals, dataset0, dataset1, groupLabels: groupVals });
  };

  const handleShow = () => {
    if (selectedAnalysis) groupData(data, selectedAnalysis);
  };

  const chartData = {
    labels: groupedData.labels,
    datasets: [
      {
        label: groupedData.groupLabels?.[0] || 'Group 1',
        data: groupedData.dataset0,
        backgroundColor: '#4caf50',
      },
      {
        label: groupedData.groupLabels?.[1] || 'Group 2',
        data: groupedData.dataset1,
        backgroundColor: '#f44336',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 20, // Font size for legend labels
          },
        },
      },
      datalabels: {
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold',
          size: 20, // Font size for data labels
        },
        formatter: value => value,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: selectedAnalysis.includes('diaBP') ? 'Average Diastolic BP' : selectedAnalysis.includes('heartRate') ? 'Average Heart Rate' : 'Average Risk',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 20, // Font size for Y-axis title
          },
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 20, // Font size for Y-axis ticks
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Group',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 20, // Font size for X-axis title
          },
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 20, // Font size for X-axis ticks
          },
        },
      },
    },
  };


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };


  // Dynamically set the chart title based on the selected group
  const chartTitle = analysisOptions.find(option => option.value === selectedAnalysis)?.label || 'Grouped Data Analysis';


  return (
    <div>

      <section className="bg-white dark:bg-neutral-900 border border-indigo-200 dark:border-neutral-700 rounded-lg shadow-md p-6 mb-10">
        <h2 className=" font-semibold  text-primary dark:text-white mb-4">Grouped Summary</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select value={selectedAnalysis} onChange={e => setSelectedAnalysis(e.target.value)}
            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md w-full md:w-2/3 bg-white dark:bg-neutral-800 text-black dark:text-white">
            <option value="" disabled>Select Analysis</option>
            {analysisOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button onClick={handleShow} className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow w-full md:w-auto">Show</button>
        </div>

        {groupedData.labels.length > 0 && (
          <h2 className='text-center'>{chartTitle}</h2>
        )}
        {groupedData.labels.length > 0 && (
          <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
        )}
      </section>

    </div>
  );
};


const DatasetVisualizer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [admin, setAdmin] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSingle, setSelectedSingle] = useState("male");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [selectedNumeric, setSelectedNumeric] = useState("age");
  const [showNumeric, setShowNumeric] = useState(false);

  const categoricalColumns = ["male", "currentSmoker", "diabetes", "BPMeds"];
  const numericColumns = ["age", "cigsPerDay", "sysBP", "diaBP", "BMI", "glucose", "totChol", "heartRate"];

  useEffect(() => {
    axios.get("https://bp-prediction-backend.onrender.com/api/hypertension/all").then((res) => {
      setData(res.data);
      setColumns(Object.keys(res.data[0] || {}));
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

  const labelMap = {
    male: { 0: "Female", 1: "Male" },
    currentSmoker: { 0: "Non-Smoker", 1: "Smoker" },
    diabetes: { 0: "No Diabetes", 1: "Diabetes" },
    BPMeds: { 0: "No Medication", 1: "On Medication" },

    // Updated bin-based labels for numeric columns
    age: {
      0: "0-10", 1: "10-20", 2: "20-30", 3: "30-40", 4: "40-50", 5: "50-60",
      6: "60-70", 7: "70-80", 8: "80-90", 9: "90-100"
    },
    cigsPerDay: {
      0: "0-5", 1: "5-10", 2: "10-15", 3: "15-20", 4: "20-25", 5: "25-30",
      6: "30-40", 7: "40-50", 8: "50-60", 9: "60-70"
    },
    sysBP: {
      0: "80-100", 1: "100-120", 2: "120-140", 3: "140-160", 4: "160-180",
      5: "180-200", 6: "200-220", 7: "220-240"
    },
    diaBP: {
      0: "40-50", 1: "50-60", 2: "60-70", 3: "70-80", 4: "80-90", 5: "90-100",
      6: "100-110", 7: "110-120"
    },
    BMI: { 0: "Under", 1: "Normal", 2: "Over", 3: "Obese" }, // Custom BMI labels
    glucose: { 0: "Low", 1: "Normal", 2: "High" }, // Custom glucose labels
    totChol: {
      0: "100-150", 1: "150-200", 2: "200-250", 3: "250-300", 4: "300-350",
      5: "350-400", 6: "400-450", 7: "450-500"
    },
    heartRate: {
      0: "40-50", 1: "50-60", 2: "60-70", 3: "70-80", 4: "80-90", 5: "90-100",
      6: "100-110", 7: "110-120"
    }
  };


  const getCounts = (col) => {
    const counts = {};
    data.forEach((row) => {
      const val = String(row[col] ?? "Unknown");
      const label = labelMap[col] ? labelMap[col][val] || val : val; // Translate categorical numbers to readable labels
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  };


  // Predefined bins for each numeric column
  const bins = {
    age: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    cigsPerDay: [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70],
    sysBP: [80, 100, 120, 140, 160, 180, 200, 220, 240],
    diaBP: [40, 50, 60, 70, 80, 90, 100, 110, 120],
    BMI: [0, 18.5, 24.9, 29.9, 40],
    glucose: [0, 69, 99, 150],
    totChol: [100, 150, 200, 250, 300, 350, 400, 450, 500],
    heartRate: [40, 50, 60, 70, 80, 90, 100, 110, 120],
  };

  const getHistogram = (col) => {
    const columnData = data.map((row) => parseFloat(row[col])).filter((v) => !isNaN(v));
    const binCounts = new Array(bins[col].length - 1).fill(0);

    columnData.forEach((value) => {
      for (let i = 0; i < bins[col].length - 1; i++) {
        if (value >= bins[col][i] && value < bins[col][i + 1]) {
          binCounts[i]++;
          break;
        }
      }
    });

    // Labels for BMI and glucose should use the labelMap for custom categories
    let labels = bins[col].slice(0, -1).map((bin, index) => `${bin} - ${bins[col][index + 1]}`);

    // For BMI and glucose, we directly use the custom labels in labelMap
    if (col === "glucose" || col === "BMI") {
      // Use the labelMap to get the custom labels for these specific columns
      labels = Object.values(labelMap[col]);
    }

    return { labels, values: binCounts };
  };

  const renderBarChart = (labels, values, label) => {
    // Generate random color for each bar
    const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

    return (
      <Bar
        data={{
          labels,
          datasets: [{
            label,
            data: values,
            backgroundColor: colors,
          }],
        }}
        options={{
          responsive: true,
          plugins: {
            datalabels: {
              display: true,
              color: darkMode ? '#000' : '#fff',
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
                color: darkMode ? "#000" : "#fff",
                font: {
                  weight: "bold",
                  size: 18,
                },
              },
            },
            tooltip: {
              bodyColor: darkMode ? "#000" : "#fff",
              titleColor: darkMode ? "#000" : "#fff",
            },
          },
          scales: {
            x: {
              ticks: {
                color: darkMode ? "#000" : "#fff",
                font: {
                  size: 18,
                },
              },
            },
            y: {
              ticks: {
                color: darkMode ? "#000" : "#fff",
                font: {
                  size: 18,
                },
              },
            },
          },
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white md:ml-64 transition-colors duration-300 text-2xl">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 shadow-md">
        <h1 className="text-2xl font-bold text-primary">Dataset Chart</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode}
            className="p-2 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition"
            title="Toggle Theme">
            {darkMode ? (<Sun className="text-yellow-400 w-6 h-6" />) : (<Moon className="text-neutral-800 dark:text-white w-6 h-6" />)}
          </button>
          <div className="flex items-center justify-between border border-primary rounded-full px-1 py-1 w-fit">
            <div className=" text-left mr-4 ml-2">
              <div className="text-sm font-bold">{admin.username?.split(" ")[0]}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-300">Admin</div>
            </div>
            <img
              src={`https://bp-prediction-backend.onrender.com/uploads/${admin.profilePicture || "default.png"}`}
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </div>
        </div>
      </header>
      <main className="bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 text-black dark:text-white p-6 ">
        {/* Categorical Feature Count Plot */}
        <section className="bg-white dark:bg-neutral-900 border border-primary dark:border-neutral-700 rounded-lg shadow-md p-6 mb-10">
          <h2 className=" font-semibold text-primary dark:text-white mb-4">Categorical Feature Count Plot </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={selectedSingle}
              onChange={(e) => setSelectedSingle(e.target.value)}
              className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md w-full md:w-2/3 bg-white dark:bg-neutral-800 text-black dark:text-white"
            >
              {categoricalColumns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <button
              onClick={() => setShowSingle(true)}
              className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow w-full md:w-auto"
            >
              Show
            </button>
          </div>
          {showSingle && selectedSingle && (() => {
            const counts = getCounts(selectedSingle);
            const labels = Object.keys(counts);
            const values = Object.values(counts);
            const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`); // Random color for each bar

            return renderBarChart(labels, values, `${selectedSingle} (%)`, colors);
          })()}
        </section>

        {/* Numeric Feature Distributions */}
        <section className="bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-700 rounded-lg shadow-md p-6 mb-10">
          <h2 className=" font-semibold  text-primary dark:text-white mb-4">Numeric Feature Distributions</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={selectedNumeric}
              onChange={(e) => setSelectedNumeric(e.target.value)}
              className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md w-full md:w-2/3 bg-white dark:bg-neutral-800 text-black dark:text-white"
            >
              {numericColumns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <button
              onClick={() => setShowNumeric(true)}
              className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow w-full md:w-auto"
            >
              Show
            </button>
          </div>
          {showNumeric && selectedNumeric && (() => {
            const { labels, values } = getHistogram(selectedNumeric); // Get histogram data
            return renderBarChart(labels, values, `${selectedNumeric} Histogram (%)`);
          })()}

        </section>
        <TargetDistributionByRisk />
        <GroupedSummary />
      </main>
    </div>
  );
};

export default DatasetVisualizer;



