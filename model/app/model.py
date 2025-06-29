from pydantic import BaseModel

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