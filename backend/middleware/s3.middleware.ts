import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BaseEnvironment } from '../Environment';

const env = new BaseEnvironment();

const s3 = new S3Client({
    region: env.MY_AWS_REGION!,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY!,
        secretAccessKey: env.MY_AWS_SECRET_KEY!,
    },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export function uploadFile(fileBuffer, fileName, mimetype) {
    const uploadParams = {
        Bucket: env.MY_AWS_BUCKET_NAME!,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype,
    };

    return s3.send(new PutObjectCommand(uploadParams));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export function deleteFile(fileName) {
    const deleteParams = {
        Bucket: env.MY_AWS_BUCKET_NAME!,
        Key: fileName,
    };

    return s3.send(new DeleteObjectCommand(deleteParams));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function getObjectSignedUrl(key) {
    const params = {
        Bucket: env.MY_AWS_BUCKET_NAME!,
        Key: key,
    };

    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const seconds = 60;
    const url = await getSignedUrl(s3, command, { expiresIn: seconds });

    return url;
}
