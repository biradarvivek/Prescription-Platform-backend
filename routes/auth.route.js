const express = require("express");
const {
  doctorSignup,
  patientSignup,
  login,
  getMe,
} = require("../controllers/auth.controller");

const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/doctor/signup", upload.single("profilePicture"), doctorSignup);
router.post("/patient/signup", upload.single("profilePicture"), patientSignup);
router.post("/login", login);
router.get("/me", auth, getMe);

module.exports = router;
