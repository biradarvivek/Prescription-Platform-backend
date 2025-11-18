const express = require("express");
const {
  getAllDoctors,
  getDoctorProfile,
  getDoctorConsultations,
  updateDoctorProfile,
} = require("../controllers/doctor.controller");

const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", auth, getAllDoctors);
router.get("/profile", auth, getDoctorProfile);
router.get("/consultations", auth, getDoctorConsultations);
router.patch(
  "/profile",
  auth,
  upload.single("profilePicture"),
  updateDoctorProfile
);

module.exports = router;
