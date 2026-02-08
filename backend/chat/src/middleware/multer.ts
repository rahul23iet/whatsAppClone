import multer  from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from 'dotenv';
config();

import cloudinary from '../config/cloudinary.js';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-documents',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg', 'heic', 'heif', 'avif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
        transformation: [{ width: 500, height: 500, crop: 'limit' },
            {quality: 'auto'}
        ],
    } as any,
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000 * 1024 * 1024 }, // 100MB);
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif', 'image/avif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    }
}); 