import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PredictionForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        male: "", age: "", currentSmoker: "", cigsPerDay: "",
        BPMeds: "", diabetes: "", totChol: "", sysBP: "",
        diaBP: "", BMI: "", heartRate: "", glucose: "", model: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "currentSmoker") {
                updated.cigsPerDay = value === "0" ? "0" : "";
            }
            return updated;
        });
    };

    const showMessage = (text, type = "error") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const validateForm = () => {
        for (const [key, value] of Object.entries(formData)) {
            if (value === "" || value === null) {
                return `Please fill the "${key}" field.`;
            }
        }

        const { age, cigsPerDay, totChol, sysBP, diaBP, BMI, heartRate, glucose } = formData;

        if (parseFloat(age) <= 0) return "Age must be a positive number.";
        if (parseFloat(cigsPerDay) < 0) return "Cigs per day cannot be negative.";
        if (parseFloat(totChol) <= 0) return "Total cholesterol must be a positive number.";
        if (parseFloat(sysBP) <= 0) return "Systolic BP must be a positive number.";
        if (parseFloat(diaBP) <= 0) return "Diastolic BP must be a positive number.";
        if (parseFloat(BMI) <= 0) return "BMI must be a positive number.";
        if (parseFloat(heartRate) <= 0) return "Heart rate must be a positive number.";
        if (parseFloat(glucose) <= 0) return "Glucose must be a positive number.";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        const error = validateForm();
        if (error) {
            showMessage(error);
            setLoading(false);
            return;
        }

        try {
            const reqBody = {
                male: parseInt(formData.male),
                age: parseInt(formData.age),
                currentSmoker: parseInt(formData.currentSmoker),
                cigsPerDay: parseFloat(formData.cigsPerDay),
                BPMeds: parseFloat(formData.BPMeds),
                diabetes: parseInt(formData.diabetes),
                totChol: parseFloat(formData.totChol),
                sysBP: parseFloat(formData.sysBP),
                diaBP: parseFloat(formData.diaBP),
                BMI: parseFloat(formData.BMI),
                heartRate: parseFloat(formData.heartRate),
                glucose: parseFloat(formData.glucose),
            };

            const modelRouteMap = {
                logistic: "logistic",
                svm: "svm",
                rf: "rf",
                tree: "tree",
                xgb: "xgb",
                lgb: "lgb"
            };

            const route = modelRouteMap[formData.model];
            if (!route) throw new Error("Invalid model selected.");

            try {
                const url = `https://bp-prediction-model.onrender.com/predict/${route}`;
                console.log(`Sending to: ${url}`);

                const predictRes = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reqBody),
                });

                if (!predictRes.ok) {
                    throw new Error("Prediction API failed.");
                }

                const predictionData = await predictRes.json();
                console.log("Prediction Response:", predictionData);

                // Continue with the rest of your logic...
            } catch (error) {
                console.error("Prediction Error:", error);
                showMessage(error.message || "An error occurred.");
            }


            if (!predictRes.ok) throw new Error("Prediction API failed.");
            const predictionData = await predictRes.json();

            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please login.");

            const recRes = await fetch("https://bp-prediction-backend.onrender.com/api/recommendation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...predictionData.data,
                    prediction: predictionData.prediction,
                    model: predictionData.model,
                    accuracy: predictionData.accuracy,
                    ...reqBody
                })
            });

            if (!recRes.ok) throw new Error("Recommendation save failed.");
            const { data } = await recRes.json();
            showMessage("Prediction saved successfully!", "success");
            navigate(`/recommendation/${data.id}`);
        } catch (error) {
            console.error(error);
            showMessage(error.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const numberInputProps = {
        step: "0.1",
        min: "0",
        onKeyDown: (e) => (e.key === "-" || e.key === "e") && e.preventDefault()
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 py-10 px-4 transition-colors duration-300 text-xl">
            <div className="w-full max-w-6xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                <h2 className="text-5xl font-bold text-center text-primary dark:text-primary mb-6">
                    Make a Prediction
                </h2>

                {message.text && (
                    <div className={`text-center mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {message.text}
                    </div>
                )}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    {/* Gender */}
                    <div>
                        <label htmlFor="male" className="block">Gender</label>
                        <select name="male" value={formData.male} onChange={handleChange}
                            className="w-full p-2 border rounded dark:border-gray-600 dark:bg-neutral-700 dark:text-white">
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div>
                        <label htmlFor="age" className="block">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange}
                            min="1" {...numberInputProps}
                            className="w-full p-2 border rounded dark:border-gray-600 dark:bg-neutral-700 dark:text-white" />
                    </div>

                    {/* Binary Selection Fields */}
                    {[
                        { name: "currentSmoker", label: "Current Smoker", options: ["Yes", "No"] },
                        { name: "BPMeds", label: "On BP Medication", options: ["Yes", "No"] },
                        { name: "diabetes", label: "Has Diabetes", options: ["Yes", "No"] },
                    ].map(({ name, label, options }) => (
                        <div key={name}>
                            <label htmlFor={name} className="block">{label}</label>
                            <select name={name} value={formData[name]} onChange={handleChange}
                                className="w-full p-2 border rounded dark:border-gray-600 dark:bg-neutral-700 dark:text-white">
                                <option value="">{label}?</option>
                                <option value="1">{options[0]}</option>
                                <option value="0">{options[1]}</option>
                            </select>
                        </div>
                    ))}

                    {/* Numeric Inputs */}
                    {[
                        { name: "cigsPerDay", label: "Cigs Per Day" },
                        { name: "totChol", label: "Total Cholesterol" },
                        { name: "sysBP", label: "Systolic BP" },
                        { name: "diaBP", label: "Diastolic BP" },
                        { name: "BMI", label: "BMI" },
                        { name: "heartRate", label: "Heart Rate" },
                        { name: "glucose", label: "Glucose" },
                    ].map(({ name, label }) => {
                        const isCigsField = name === "cigsPerDay";
                        const isDisabled = isCigsField && formData.currentSmoker === "0";
                        return (
                            <div key={name}>
                                <label htmlFor={name} className="block">{label}</label>
                                <input
                                    type="number"
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    {...numberInputProps}
                                    className={`w-full p-2 border rounded dark:border-gray-600 dark:bg-neutral-700 dark:text-white ${isDisabled ? "bg-gray-200 dark:bg-neutral-600 cursor-not-allowed" : ""}`}
                                    disabled={isDisabled}
                                    readOnly={isDisabled}
                                />
                            </div>
                        );
                    })}

                    {/* Model Selection */}
                    <div className="md:col-span-2">
                        <label htmlFor="model" className="block">Select Model</label>
                        <select name="model" value={formData.model} onChange={handleChange}
                            className="w-full p-2 border rounded dark:border-gray-600 dark:bg-neutral-700 dark:text-white">
                            <option value="">Select Model</option>
                            <option value="logistic">Logistic Regression</option>
                            <option value="svm">Support Vector Machine (SVM)</option>
                            <option value="rf">Random Forest</option>
                            <option value="tree">Decision Tree</option>
                            <option value="xgb">XGBoost</option>
                            <option value="lgb">LightGBM</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-primary hover:bg-primary text-white font-semibold py-2 rounded"
                        >
                            {loading ? "Predicting..." : "Predict Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PredictionForm;
