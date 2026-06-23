import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Ensure uploads directory exists for the local fallback
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Check if Cloudinary credentials are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  console.log('Cloud File Storage Enabled: Connecting to Cloudinary...');
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Configure Cloudinary Storage for Multer
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'bapuji_surgicals_uploads',
      resource_type: 'auto', // Auto-detect formats (raw/images/pdfs/etc.)
      public_id: (req, file) => {
        // Strip out the file extension for Cloudinary public ID
        const fileExt = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExt);
        return `${file.fieldname}-${baseName.replace(/\s+/g, '-')}-${Date.now()}`;
      }
    }
  });
} else {
  console.warn('==================================================');
  console.warn('WARNING: Cloudinary credentials not configured in backend/.env.');
  console.warn('Gracefully falling back to LOCAL DISK FILE STORAGE.');
  console.warn('Files will be stored in: backend/uploads/');
  console.warn('==================================================');

  // Fallback to Local Disk Storage
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    }
  });
}

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX) and images (JPG, PNG) are allowed!'));
  }
}

export const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
