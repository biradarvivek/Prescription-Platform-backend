const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    historyOfSurgery: [String],
    historyOfIllness: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("patient", patientSchema);
