const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadAtCloudinary(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "products",
  });
  let photo = await result.secure_url;
  return photo;
}


async function uploadMultipleFiles(filePaths) {
  const uploadPromises = filePaths.map(filePath => uploadAtCloudinary(filePath));
  const resultUrls = await Promise.all(uploadPromises);
  return resultUrls;
}

module.exports = {uploadAtCloudinary,uploadMultipleFiles};
