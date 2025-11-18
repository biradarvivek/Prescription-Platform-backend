const express = require("express");
const {
  createConsultation,
  getPatientConsultations,
  getConsultationById,
  getPaymentQR,
} = require("../controllers/consultation.controller");

const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/payment-qr", auth, getPaymentQR);
router.post("/", auth, createConsultation);
router.get("/my-consultations", auth, getPatientConsultations);
router.get("/:id", auth, getConsultationById);

module.exports = router;
