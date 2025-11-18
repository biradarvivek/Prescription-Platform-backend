const cloudinary = require("../config/cloudinary.config");
const stream = require("stream");

const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      resource_type = "raw",
      format = "pdf",
      public_id = `prescription_${Date.now()}`,
      folderPrefix = "prescription-platform",
    } = options;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${folderPrefix}/${folder}`,
        resource_type,
        format,
        public_id,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
