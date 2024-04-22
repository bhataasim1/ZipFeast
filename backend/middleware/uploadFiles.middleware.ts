import multer from 'multer';
import fs from 'fs';
import { BaseEnvironment } from '../Environment';
import { allowdFileTypes } from '../types';

const env = new BaseEnvironment();

function createUploadMiddleware(type: string) {
    const baseDir = `${env.UPLOAD_DIR}/${type}`;

    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: baseDir,
        filename: (req, file, cb) => {
            const filename =
                `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`.toLowerCase();
            cb(null, filename);
        },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const fileFilter = (req, file, cb) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (allowdFileTypes[type].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const limits = {
        files: 1,
        fileSize: 1024 * 1024 * 1,
        fieldNameSize: 100,
    };

    const upload = multer({
        storage,
        fileFilter,
        limits,
    });

    return upload.single(type);
}

// Export a helper function to simplify usage
export function upload(type: string) {
    return createUploadMiddleware(type);
}
