const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },
    careToBeTaken: {
      type: String,
      required: true,
    },
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    pdfUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "sent"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
