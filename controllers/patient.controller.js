const Patient = require("../models/patient.model");
const { uploadToCloudinary } = require("../utils.js/cloudinaryUpload.utils");

// Get logged-in patient profile
async function getPatientProfile(req, res) {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate(
      "user"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ status: "success", patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update patient profile
async function updatePatientProfile(req, res) {
  try {
    const { name, age, phoneNumber, historyOfSurgery, historyOfIllness } =
      req.body;

    const update = {
      name,
      age: parseInt(age),
      phoneNumber,
      historyOfSurgery: historyOfSurgery
        ? historyOfSurgery.split(",").map((s) => s.trim())
        : [],
      historyOfIllness: historyOfIllness
        ? historyOfIllness.split(",").map((s) => s.trim())
        : [],
    };

    if (req.file) {
      const upload = await uploadToCloudinary(
        req.file.buffer,
        "patient-profiles"
      );
      update.profilePicture = upload.secure_url;
    }

    const patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      update,
      { new: true }
    );

    res.json({ status: "success", patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getPatientProfile,
  updatePatientProfile,
};
