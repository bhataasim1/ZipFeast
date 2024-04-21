// import multer from 'multer';
// import fs from 'fs';
// import { BaseEnvironment } from '../Environment';
// import { allowdFileTypes } from '../types';

// const env = new BaseEnvironment();

// export class UploadFilesMiddleware {
//     private static instance: UploadFilesMiddleware;

//     private constructor() {}

//     static getInstance() {
//         if (!UploadFilesMiddleware.instance) {
//             UploadFilesMiddleware.instance = new UploadFilesMiddleware();
//         }
//         return UploadFilesMiddleware.instance;
//     }

//     private createDirectoryIfNotExists(directory: string) {
//         if (!fs.existsSync(directory)) {
//             fs.mkdirSync(directory, { recursive: true });
//         }
//     }

//     private getDestination(type: string) {
//         const baseDir = `${env.UPLOAD_DIR}/${type}`;
//         this.createDirectoryIfNotExists(baseDir);
//         return multer({
//             storage: multer.diskStorage({
//                 destination: baseDir,
//                 filename: (req, file, cb) => {
//                     const filename =
//                         `${Date.now()}-${file.originalname.split(' ').join('-')}`.toLowerCase();
//                     cb(null, filename);
//                 },
//             }),
//             fileFilter: (req, file, cb) => {
//                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 //@ts-ignore
//                 if (allowdFileTypes[type].includes(file.mimetype)) {
//                     cb(null, true);
//                 } else {
//                     cb(null, false);
//                 }
//             },
//             ///TODO: Need to handle the errors it crashes the Server if the file size is too big..
//             limits: {
//                 files: 1,
//                 fileSize: 1024 * 1024 * 1,
//                 fieldNameSize: 100,
//             },
//         });
//     }

//     public avatar = this.getDestination('avatar').single('avatar');
// }

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
