import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { BaseEnvironment } from '../Environment';
import { Request, Response, NextFunction } from 'express';

const env = new BaseEnvironment();

const s3 = new S3Client({
    region: env.MY_AWS_REGION!,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY!,
        secretAccessKey: env.MY_AWS_SECRET_KEY!,
    },
});

function createUploadMiddleware(type: string) {
    const storage = multerS3({
        s3: s3,
        bucket: env.MY_AWS_BUCKET_NAME!,
        key: (req, file, cb) => {
            const filename =
                `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`.toLowerCase();
            cb(null, `${type}/${filename}`);
        },
    });

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        const allowedTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
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
