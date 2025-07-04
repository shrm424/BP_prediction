import joblib
import pandas as pd
import xgboost as xgb
import lightgbm as lgb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics import accuracy_score
from app.model import HealthInput

# ---------------------- Setup FastAPI ---------------------- #
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bp-prediction-frontend.onrender.com"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# ---------------------- Load Models ------------------------ #
svm_model = joblib.load("models/svm_model_export.joblib")
rf_model = joblib.load("models/random_forest_model_export.joblib")
log_model = joblib.load("models/logistic_model_export.joblib")
tree_model = joblib.load("models/decision_tree_model_export.joblib")

xgb_model = xgb.XGBClassifier()
xgb_model.load_model("models/xgboost_model.json")

lgb_model = lgb.Booster(model_file="models/lightgbm_model.json")

# ---------------------- Load Test Data ---------------------- #
def load_test_data(path_name):
    data = pd.read_csv(path_name)
    return data.drop(columns=["Unnamed: 0"], errors='ignore')

X_test = load_test_data("datasets/X_test.csv")
y_test = load_test_data("datasets/y_test.csv").values.ravel()

# Sklearn-based models (return binary labels)
svm_accuracy = round(accuracy_score(y_test, svm_model.predict(X_test)), 4)
rf_accuracy = round(accuracy_score(y_test, rf_model.predict(X_test)), 4)
log_accuracy = round(accuracy_score(y_test, log_model.predict(X_test)), 4)
tree_accuracy = round(accuracy_score(y_test, tree_model.predict(X_test)), 4)
xgb_accuracy = round(accuracy_score(y_test, xgb_model.predict(X_test)), 4)

# LightGBM (returns probabilities, must threshold)
lgb_predictions = lgb_model.predict(X_test.values)  # Probabilities
lgb_binary = [1 if p >= 0.5 else 0 for p in lgb_predictions]  # Convert to 0/1
lgb_accuracy = round(accuracy_score(y_test, lgb_binary), 4)

# ---------------------- Prediction Helper ------------------- #
def predict_model(model, input_df, model_type="sklearn"):
    if model_type == "lightgbm":
        return int(model.predict(input_df.values)[0] >= 0.5)
    else:
        return int(model.predict(input_df)[0])

# ---------------------- API Endpoints ----------------------- #
@app.get("/")
def root():
    return {"message": "Welcome to Health Prediction API"}

@app.post("/predict/svm")
def predict_svm(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(svm_model, input_df)
    return {
        "model": "SVM",
        "prediction": prediction,
        "accuracy": f"{svm_accuracy*100:.2f}%"
    }

@app.post("/predict/rf")
def predict_rf(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(rf_model, input_df)
    return {
        "model": "Random Forest",
        "prediction": prediction,
        "accuracy": f"{rf_accuracy*100:.2f}%"
    }

@app.post("/predict/logistic")
def predict_logistic(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(log_model, input_df)
    return {
        "model": "Logistic Regression",
        "prediction": prediction,
        "accuracy": f"{log_accuracy*100:.2f}%"
    }

@app.post("/predict/tree")
def predict_tree(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(tree_model, input_df)
    return {
        "model": "Decision Tree",
        "prediction": prediction,
        "accuracy": f"{tree_accuracy*100:.2f}%"
    }

@app.post("/predict/xgb")
def predict_xgb(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(xgb_model, input_df)
    return {
        "model": "XGBoost",
        "prediction": prediction,
        "accuracy": f"{xgb_accuracy*100:.2f}%"
    }

@app.post("/predict/lgb")
def predict_lgb(data: HealthInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = predict_model(lgb_model, input_df, model_type="lightgbm")
    return {
        "model": "LightGBM",
        "prediction": prediction,
        "accuracy": f"{lgb_accuracy*100:.2f}%"
    }
