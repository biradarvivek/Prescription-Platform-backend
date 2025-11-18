const QRCode = require("qrcode");

async function generateUPIqr(amount = 500) {
  try {
    const upiLink = `upi://pay?pa=doctor@upi&pn=Doctor%20Consultation&am=${amount}&cu=INR`;

    const qr = await QRCode.toDataURL(upiLink);
    return qr;
  } catch (error) {
    console.error("QR GENERATION ERROR:", error);
    throw error;
  }
}

module.exports = { generateUPIqr };
