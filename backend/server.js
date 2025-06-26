const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/user');
const predictionRoute = require('./routes/predictionRoute');
const hypertensionRoutes = require('./routes/hypertension');
const ReportRouter = require('./routes/reportRoute');
const updateProfileRouter = require("./routes/updateProfileRouter");
const loginOtpVerfiy = require("./routes/loginOtpVerfiy");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/recommendation', predictionRoute); //recommandarion link 
app.use("/api/", profileRoutes);
app.use("/api/", authRoutes);
app.use("/api/profileUpdate/", updateProfileRouter);
app.use("/api/login-otp/", loginOtpVerfiy);

app.use('/api/predictions', predictionRoute);

app.use('/api/report', ReportRouter);


app.use('/api/hypertension', hypertensionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
