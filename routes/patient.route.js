const express = require("express");
const {
  getPatientProfile,
  updatePatientProfile,
} = require("../controllers/patient.controller");

const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/profile", auth, getPatientProfile);
router.patch(
  "/profile",
  auth,
  upload.single("profilePicture"),
  updatePatientProfile
);

module.exports = router;
