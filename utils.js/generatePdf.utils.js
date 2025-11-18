const PDFDocument = require("pdfkit");

async function generatePrescriptionPDFBuffer(prescriptionData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ autoFirstPage: true, margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.fontSize(20).text("MEDICAL PRESCRIPTION", { align: "center" });
      doc.moveDown(1.2);

      doc.fontSize(14).text("Doctor Information:", { underline: true });
      const docDoctor = prescriptionData.consultation?.doctor || {};
      doc
        .fontSize(12)
        .text(`Name: Dr. ${docDoctor.name || "N/A"}`)
        .text(`Specialty: ${docDoctor.specialty || "N/A"}`)
        .text(`Experience: ${docDoctor.yearsOfExperience || "N/A"} years`);
      doc.moveDown();

      const pat = prescriptionData.consultation?.patient || {};
      doc.fontSize(14).text("Patient Information:", { underline: true });
      doc
        .fontSize(12)
        .text(`Name: ${pat.name || "N/A"}`)
        .text(`Age: ${pat.age || "N/A"}`);
      doc.moveDown();

      doc.fontSize(14).text("Consultation Details:", { underline: true });
      doc
        .fontSize(12)
        .text(
          `Current Illness: ${
            prescriptionData.consultation?.currentIllnessHistory || "N/A"
          }`
        )
        .text(
          `Date: ${new Date(
            prescriptionData.createdAt || Date.now()
          ).toLocaleString()}`
        );
      doc.moveDown();

      doc.fontSize(14).text("Prescription:", { underline: true });
      doc.fontSize(12).text("Care to be taken:");
      doc.text(prescriptionData.careToBeTaken || "-", { paragraphGap: 6 });
      doc.moveDown();

      doc.text("Medications:", { underline: true });
      const meds = prescriptionData.medicines || [];
      if (meds.length === 0) {
        doc.text("No medications listed.");
      } else {
        meds.forEach((m, i) => {
          doc.text(
            `${i + 1}. ${m.name || "-"} - ${m.dosage || "-"} - ${
              m.frequency || "-"
            } - ${m.duration || "-"}`
          );
        });
      }

      doc.moveDown(2);
      doc.text(`Prescribed on: ${new Date().toLocaleString()}`);
      doc.moveDown(2);
      doc.text("Signature: ___________________", { align: "left" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePrescriptionPDFBuffer };
