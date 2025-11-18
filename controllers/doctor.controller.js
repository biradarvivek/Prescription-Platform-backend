const Doctor = require("../models/doctor.model");
const Consultation = require("../models/consultation.model");
const { uploadToCloudinary } = require("../utils.js/cloudinaryUpload.utils");

async function getAllDoctors(req, res) {
  const doctors = await Doctor.find();
  res.json({ status: "success", doctors });
}

async function getDoctorProfile(req, res) {
  const doctor = await Doctor.findOne({ user: req.user.id }).populate("user");
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  res.json({ status: "success", doctor });
}

async function getDoctorConsultations(req, res) {
  const doctor = await Doctor.findOne({ user: req.user.id });

  const consultations = await Consultation.find({ doctor: doctor._id })
    .populate({
      path: "patient",
      model: "patient",
    })
    .sort({ createdAt: -1 });

  res.json({ status: "success", consultations });
}

async function updateDoctorProfile(req, res) {
  let update = req.body;

  if (req.file) {
    const upload = await uploadToCloudinary(req.file.buffer, "doctor-profiles");
    update.profilePicture = upload.secure_url;
  }

  const doctor = await Doctor.findOneAndUpdate({ user: req.user.id }, update, {
    new: true,
  });

  res.json({ status: "success", doctor });
}

module.exports = {
  getAllDoctors,
  getDoctorProfile,
  getDoctorConsultations,
  updateDoctorProfile,
};
