import multer from 'multer';
import fs from 'fs';
import { BaseEnvironment } from '../Environment';

const env = new BaseEnvironment();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = env.UPLOAD_DIR;

        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating upload directory:', err);
            }
            cb(null, uploadDir);
        });
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage });
