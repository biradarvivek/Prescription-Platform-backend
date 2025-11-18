const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
require("dotenv").config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/doctors", require("./routes/doctor.route"));
app.use("/api/patients", require("./routes/patient.route"));
app.use("/api/consultations", require("./routes/consultation.route"));
app.use("/api/prescriptions", require("./routes/prescription.route"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
