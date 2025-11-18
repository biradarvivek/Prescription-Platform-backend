const Prescription = require("../models/prescription.model");
const Consultation = require("../models/consultation.model");
const {
  generatePrescriptionPDFBuffer,
} = require("../utils.js/generatePdf.utils");
const { uploadToCloudinary } = require("../utils.js/cloudinaryUpload.utils");

async function createPrescription(req, res) {
  try {
    const prescription = await Prescription.create(req.body);
    await Consultation.findByIdAndUpdate(req.body.consultation, {
      status: "completed",
    });

    res.status(201).json({ status: "success", prescription });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function generatePrescriptionPDFController(req, res) {
  try {
    const prescription = await Prescription.findById(req.params.id).populate({
      path: "consultation",
      populate: [
        { path: "patient", model: "patient" },
        { path: "doctor", model: "doctor" },
      ],
    });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const pdfBuffer = await generatePrescriptionPDFBuffer(prescription);

    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(pdfBuffer, "prescriptions", {
        resource_type: "raw",
        format: "pdf",
        public_id: `prescription_${prescription._id}`,
      });

      prescription.pdfUrl = uploadResult.secure_url;
      prescription.status = "sent";
      await prescription.save();
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
    }

    if (req.query.download === "true") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="prescription-${prescription._id}.pdf"`
      );
      return res.send(pdfBuffer);
    }

    res.json({
      status: "success",
      pdfUrl: prescription.pdfUrl || uploadResult?.secure_url,
      message:
        "PDF generated. Add ?download=true to the request to download the file directly.",
    });
  } catch (err) {
    console.error("generatePrescriptionPDFController error:", err);
    res.status(500).json({ message: err.message });
  }
}

async function getPrescriptionsByConsultation(req, res) {
  try {
    const prescriptions = await Prescription.find({
      consultation: req.params.consultationId,
    });

    res.json({ status: "success", prescriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updatePrescription(req, res) {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ status: "success", prescription });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deletePrescription(req, res) {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createPrescription,
  generatePrescriptionPDF: generatePrescriptionPDFController,
  getPrescriptionsByConsultation,
  updatePrescription,
  deletePrescription,
};
