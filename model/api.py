from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import xgboost as xgb
import lightgbm as lgb
from sklearn.metrics import accuracy_score

# ---------------------- Setup FastAPI ---------------------- #
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# ---------------------- Load Models ------------------------ #
svm_model = joblib.load("svm_model_export.joblib")
rf_model = joblib.load("random_forest_model_export.joblib")
log_model = joblib.load("logistic_model_export.joblib")
tree_model = joblib.load("decision_tree_model_export.joblib")

xgb_model = xgb.XGBClassifier()
xgb_model.load_model("xgboost_model.json")

lgb_model = lgb.Booster(model_file="lightgbm_model.json")

# ---------------------- Load Test Data --------------------- #
test_data = pd.read_csv("cleaned_df.csv")
if "Unnamed: 0" in test_data.columns:
    test_data.drop(columns=["Unnamed: 0"], inplace=True)

X_test = test_data.drop("Risk", axis=1)
y_test = test_data["Risk"]

# ---------------------- Accuracy Scores --------------------- #
svm_accuracy = accuracy_score(y_test, svm_model.predict(X_test))
rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test))
log_accuracy = accuracy_score(y_test, log_model.predict(X_test))
tree_accuracy = accuracy_score(y_test, tree_model.predict(X_test))
xgb_accuracy = accuracy_score(y_test, xgb_model.predict(X_test))

lgb_predictions = lgb_model.predict(X_test.values)
lgb_predictions_binary = [1 if p >= 0.5 else 0 for p in lgb_predictions]
lgb_accuracy = accuracy_score(y_test, lgb_predictions_binary)

# ---------------------- Input Schema ------------------------ #
class HealthInput(BaseModel):
    male: int
    age: int
    currentSmoker: int
    cigsPerDay: float
    BPMeds: float
    diabetes: int
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float

# ---------------------- Prediction Helper ------------------- #
def predict_model(model, input_df, model_type="sklearn"):
    if model_type == "lightgbm":
        return int(model.predict(input_df.values)[0])
    else:
        return int(model.predict(input_df)[0])

# ---------------------- API Endpoints ----------------------- #
@app.post("/predict/svm")
def predict_svm(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(svm_model, input_df)
    return {"model": "SVM", "prediction": prediction, "accuracy": f"{svm_accuracy*100:.2f}%"}

@app.post("/predict/rf")
def predict_rf(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(rf_model, input_df)
    return {"model": "Random Forest", "prediction": prediction, "accuracy": f"{rf_accuracy*100:.2f}%"}

@app.post("/predict/logistic")
def predict_logistic(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(log_model, input_df)
    return {"model": "Logistic Regression", "prediction": prediction, "accuracy": f"{log_accuracy*100:.2f}%"}

@app.post("/predict/tree")
def predict_tree(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(tree_model, input_df)
    return {"model": "Decision Tree", "prediction": prediction, "accuracy": f"{tree_accuracy*100:.2f}%"}

@app.post("/predict/xgb")
def predict_xgb(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(xgb_model, input_df)
    return {"model": "XGBoost", "prediction": prediction, "accuracy": f"{xgb_accuracy*100:.2f}%"}

@app.post("/predict/lgb")
def predict_lgb(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(lgb_model, input_df, model_type="lightgbm")
    return {"model": "LightGBM", "prediction": prediction, "accuracy": f"{lgb_accuracy*100:.2f}%"}

# ---------------------- Run Server -------------------------- #
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7000)
