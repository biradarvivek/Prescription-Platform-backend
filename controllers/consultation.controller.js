const Consultation = require("../models/consultation.model");
const Patient = require("../models/patient.model");
const { generateUPIqr } = require("../utils.js/generateQr.utils");

async function createConsultation(req, res) {
  try {
    const {
      doctor,
      currentIllnessHistory,
      recentSurgery,
      familyMedicalHistory,
      payment,
    } = req.body;

    let errors = [];

    if (!doctor) errors.push("Doctor ID is required");
    if (!currentIllnessHistory || currentIllnessHistory.trim() === "")
      errors.push("Current illness history is required");

    if (!familyMedicalHistory?.diabetics)
      errors.push("Diabetic / Non-Diabetic selection is required");

    if (!payment?.transactionId || payment.transactionId.trim() === "")
      errors.push("Transaction ID is required");

    if (errors.length > 0) {
      return res.status(400).json({
        status: "fail",
        errors,
      });
    }

    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const consultation = await Consultation.create({
      patient: patient._id,
      doctor,
      currentIllnessHistory,
      recentSurgery,
      familyMedicalHistory,
      payment: {
        transactionId: payment.transactionId,
        status: "completed",
      },
      status: "pending",
    });

    res.status(201).json({ status: "success", consultation });
  } catch (err) {
    console.log("Consultation Error:", err);
    res.status(400).json({ message: "Invalid consultation data" });
  }
}

async function getPatientConsultations(req, res) {
  try {
    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const consultations = await Consultation.find({
      patient: patient._id,
    })
      .populate({ path: "doctor", model: "doctor" })

      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      consultations,
    });
  } catch (err) {
    console.log("Error fetching consultations:", err);
    res.status(500).json({ message: err.message });
  }
}

async function getConsultationById(req, res) {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate({ path: "patient", model: "patient" })

      .populate({ path: "doctor", model: "doctor" });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({ status: "success", consultation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPaymentQR(req, res) {
  try {
    const qr = await generateUPIqr(500);
    res.status(200).json({
      status: "success",
      qr,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "QR code generation failed",
      error: err.message,
    });
  }
}

module.exports = {
  createConsultation,
  getPatientConsultations,
  getConsultationById,
  getPaymentQR,
};
