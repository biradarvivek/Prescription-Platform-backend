const express = require("express");
const {
  createPrescription,
  generatePrescriptionPDF,
  getPrescriptionsByConsultation,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescription.controller");

const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", auth, createPrescription);
router.get("/:id/generate-pdf", auth, generatePrescriptionPDF);
router.get(
  "/consultation/:consultationId",
  auth,
  getPrescriptionsByConsultation
);
router.put("/:id", auth, updatePrescription);
router.delete("/:id", auth, deletePrescription);

module.exports = router;
