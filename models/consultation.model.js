const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    currentIllnessHistory: {
      type: String,
      required: true,
    },
    recentSurgery: {
      surgery: String,
      timeSpan: String,
    },
    familyMedicalHistory: {
      diabetics: {
        type: String,
        enum: ["Diabetic", "Non-Diabetic"],
        required: true,
      },
      allergies: String,
      others: String,
    },
    payment: {
      transactionId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);
