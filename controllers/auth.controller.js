const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const { uploadToCloudinary } = require("../utils.js/cloudinaryUpload.utils");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

function sendToken(user, res) {
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    },
  });
}

async function doctorSignup(req, res) {
  try {
    const { email, password, name, specialty, phoneNumber, yearsOfExperience } =
      req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    let imageUrl = "";

    if (req.file) {
      const upload = await uploadToCloudinary(
        req.file.buffer,
        "doctor-profiles"
      );
      imageUrl = upload.secure_url;
    }

    const user = await User.create({
      email,
      password,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      user: user._id,
      profilePicture: imageUrl,
      name,
      specialty,
      phoneNumber,
      yearsOfExperience,
    });

    user.profile = doctor._id;
    await user.save();

    await user.populate("profile");

    sendToken(user, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function patientSignup(req, res) {
  try {
    const {
      email,
      password,
      name,
      age,
      phoneNumber,
      historyOfSurgery,
      historyOfIllness,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    let imageUrl = "";

    if (req.file) {
      const upload = await uploadToCloudinary(
        req.file.buffer,
        "patient-profiles"
      );
      imageUrl = upload.secure_url;
    }

    const user = await User.create({
      email,
      password,
      role: "patient",
    });

    const patient = await Patient.create({
      user: user._id,
      profilePicture: imageUrl,
      name,
      age,
      phoneNumber,
      historyOfSurgery: historyOfSurgery?.split(",").map((s) => s.trim()) || [],
      historyOfIllness: historyOfIllness?.split(",").map((s) => s.trim()) || [],
    });

    user.profile = patient._id;
    await user.save();

    await user.populate("profile");

    sendToken(user, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("profile");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const ok = await user.correctPassword(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Invalid email or password" });

    sendToken(user, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getMe(req, res) {
  const user = await User.findById(req.user.id).populate("profile");

  res.json({
    status: "success",
    user,
  });
}

module.exports = {
  doctorSignup,
  patientSignup,
  login,
  getMe,
};
