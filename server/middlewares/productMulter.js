// multerConfig/productMulter.js

import multer from "multer";
import path from "path";

// Storage config: saves images to 'uploads/products'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer middleware for product images
const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Max 2MB per file
    files: 4, // Max 4 files
  },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowed.test(file.mimetype);
    if (extValid && mimeValid) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
}).array("images", 4); // Accept 'images' field with up to 4 files

export default uploadProductImages;
