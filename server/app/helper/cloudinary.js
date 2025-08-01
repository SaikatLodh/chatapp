const cloudinary = require("cloudinary").v2;
const env = require("dotenv");
const fs = require("fs");
env.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const uploadFile = async (localfilePath) => {
  if (!localfilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localfilePath);
    return {
      publicId: response.public_id,
      url: response.secure_url,
    };
  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};

// Upload multiple files
const uploadFiles = async (localFilePaths) => {
  if (!Array.isArray(localFilePaths) || localFilePaths.length === 0) return [];
  const results = [];
  for (const filePath of localFilePaths) {
    const res = await uploadFile(filePath.path);

    results.push(res);
  }

  return results;
};

const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const deleteVideo = async (publicId) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const deleteRaw = async (publicId) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const deleteImages = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return [];
  const results = [];
  for (const publicId of publicIds) {
    const res = await deleteImage(publicId);
    results.push(res);
  }
  return results;
};

const deleteVideos = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return [];
  const results = [];
  for (const publicId of publicIds) {
    const res = await deleteVideo(publicId);
    results.push(res);
  }
  return results;
};

const deleteRaws = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return [];
  const results = [];
  for (const publicId of publicIds) {
    const res = await deleteVideo(publicId);
    results.push(res);
  }
  return results;
};

module.exports = {
  uploadFile,
  uploadFiles,
  deleteImage,
  deleteVideo,
  deleteRaw,
  deleteImages,
  deleteVideos,
  deleteRaws,
};
