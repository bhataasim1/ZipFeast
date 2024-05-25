import dotenv from 'dotenv';
dotenv.config();

export type Environmnent = 'development' | 'production';
export class BaseEnvironment {
    defaultEnvironmentValues = {
        DATABASE_URL: 'file:./ZipFeast.db',
        PORT: 3000,
        HOST: 'http://localhost',
        NODE_ENV: 'development',
        ACCESS_TOKEN_SECRET: 'my-local-ZipFeast-secret',
        ACCESS_TOKEN_LIFE: '1h',
        REFRESH_TOKEN_SECRET: 'my-local-secret',
        UPLOAD_DIR: 'uploads',
        MY_AWS_REGION: 'your-region',
        MY_AWS_ACCESS_KEY: 'your-access-key',
        MY_AWS_SECRET_KEY: 'your-secret-key',
        MY_AWS_BUCKET_NAME: 'your-bucket-name',
    };
    get environment(): Environmnent {
        return process.env.NODE_ENV as Environmnent;
    }

    get DATABASE_URL(): string {
        return (
            process.env.DATABASE_URL! ||
            this.defaultEnvironmentValues.DATABASE_URL
        );
    }

    get PORT() {
        return process.env.PORT || this.defaultEnvironmentValues.PORT;
    }

    get HOST(): string {
        return process.env.HOST! || this.defaultEnvironmentValues.HOST;
    }

    get ACCESS_TOKEN_SECRET(): string {
        return (
            process.env.ACCESS_TOKEN_SECRET! ||
            this.defaultEnvironmentValues.ACCESS_TOKEN_SECRET
        );
    }

    get ACCESS_TOKEN_LIFE(): string {
        return (
            process.env.ACCESS_TOKEN_LIFE! ||
            this.defaultEnvironmentValues.ACCESS_TOKEN_LIFE
        );
    }

    get REFRESH_TOKEN_SECRET(): string {
        return (
            process.env.REFRESH_TOKEN_SECRET! ||
            this.defaultEnvironmentValues.REFRESH_TOKEN_SECRET
        );
    }

    get UPLOAD_DIR(): string {
        return (
            process.env.UPLOAD_DIR! || this.defaultEnvironmentValues.UPLOAD_DIR
        );
    }

    get MY_AWS_REGION(): string {
        return (
            process.env.MY_AWS_REGION! ||
            this.defaultEnvironmentValues.MY_AWS_REGION
        );
    }

    get MY_AWS_ACCESS_KEY(): string {
        return (
            process.env.MY_AWS_ACCESS_KEY! ||
            this.defaultEnvironmentValues.MY_AWS_ACCESS_KEY
        );
    }

    get MY_AWS_SECRET_KEY(): string {
        return (
            process.env.MY_AWS_SECRET_KEY! ||
            this.defaultEnvironmentValues.MY_AWS_SECRET_KEY
        );
    }

    get MY_AWS_BUCKET_NAME(): string {
        return (
            process.env.MY_AWS_BUCKET_NAME! ||
            this.defaultEnvironmentValues.MY_AWS_BUCKET_NAME
        );
    }
}
