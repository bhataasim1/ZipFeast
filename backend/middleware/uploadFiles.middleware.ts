import multer from 'multer';
import fs from 'fs';
import { BaseEnvironment } from '../Environment';
import { allowdFileTypes } from '../types';

const env = new BaseEnvironment();

export class UploadFilesMiddleware {
    private static instance: UploadFilesMiddleware;

    private constructor() {}

    static getInstance() {
        if (!UploadFilesMiddleware.instance) {
            UploadFilesMiddleware.instance = new UploadFilesMiddleware();
        }
        return UploadFilesMiddleware.instance;
    }

    private createDirectoryIfNotExists(directory: string) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    private getDestination(type: string) {
        const baseDir = `${env.UPLOAD_DIR}/${type}`;
        this.createDirectoryIfNotExists(baseDir);
        return multer({
            storage: multer.diskStorage({
                destination: baseDir,
                filename: (req, file, cb) => {
                    const filename =
                        `${Date.now()}-${file.originalname.split(' ').join('-')}`.toLowerCase();
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                if (allowdFileTypes[type].includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
            limits: {
                files: 1,
                fileSize: 1024 * 1024 * 2,
                fieldNameSize: 100,
            },
        });
    }

    public avatar = this.getDestination('avatar').single('avatar');
}
