import multer from 'multer';
import fs from 'fs';
import { BaseEnvironment } from '../Environment';
// import { allowdFileTypes } from '../types/types';
import { Request, Response, NextFunction } from 'express';

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

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        //allow only the images with png, jpg, jpeg format
        const allowedTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, true);
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

export function upload(type: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createUploadMiddleware(type)(req, res, (err: any) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: 'File upload error', details: err.message });
            }
            next();
        });
    };
}
