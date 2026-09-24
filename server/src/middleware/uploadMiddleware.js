import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}`);
  },
});

// File Filter (Disallow dangerous executables, allow images, docs, pdfs, CAD)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg|pdf|doc|docx|xls|xlsx|txt|dwg|dxf|zip/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  
  // Forbidden extensions
  const forbiddenExtensions = /exe|bat|cmd|sh|php|js|py|vbs|msi|bin|jar/;
  if (forbiddenExtensions.test(path.extname(file.originalname).toLowerCase())) {
    return cb(new Error('Executable and script files are strictly prohibited!'), false);
  }

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload image, document, or PDF files.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
