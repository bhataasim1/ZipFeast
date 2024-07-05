import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import bcrypt from 'bcrypt';
import { UserProfileController } from '../User/UserProfile.controller';
import { generateAccessToken, generateRefreshToken } from '../../middleware';
import { PayloadType, UploadFile } from '../../types';

export class HomeServicesAuthController extends UserProfileController {
    constructor() {
        super();
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    async registerUser(req: Request, res: Response) {
        const {
            name,
            email,
            phone,
            serviceType,
            address,
            city,
            state,
            pincode,
            password,
            confirmPassword,
            price,
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !serviceType ||
            !address ||
            !city ||
            !state ||
            !pincode ||
            !price ||
            !password ||
            !confirmPassword
        ) {
            return this.sendErrorResponse(res, 'All fields are required', 400);
        }

        if (password !== confirmPassword) {
            return this.sendErrorResponse(res, 'Passwords do not match', 400);
        }

        try {
            const existingUser = await prisma.serviceProvider.findFirst({
                where: {
                    OR: [{ email }, { phone }],
                },
            });

            if (existingUser?.email === email) {
                return this.sendErrorResponse(
                    res,
                    'User Email already exists',
                    400
                );
            }

            if (existingUser?.phone === phone) {
                return this.sendErrorResponse(
                    res,
                    'User Phone Number already exists',
                    400
                );
            }

            const avatar = req.file as UploadFile;

            if (!avatar) {
                return this.sendErrorResponse(res, 'Avatar is required', 400);
            }

            const hashedPassword = await this.hashPassword(password);

            const user = await prisma.serviceProvider.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    serviceType,
                    address,
                    city,
                    state,
                    pincode,
                    avatar: avatar?.location,
                    price,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    phone: true,
                    serviceType: true,
                    address: true,
                    city: true,
                    state: true,
                    pincode: true,
                    price: true,
                },
            });

            return this.sendSuccessResponse(
                res,
                'User registered successfully',
                user,
                201
            );
        } catch (error) {
            return this.sendErrorResponse(
                res,
                'Something went wrong',
                500,
                error
            );
        }
    }

    async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return this.sendErrorResponse(res, 'All fields are required', 400);
        }

        try {
            const user = await prisma.serviceProvider.findFirst({
                where: {
                    email,
                },
            });

            if (!user) {
                return this.sendErrorResponse(res, 'User does not exist', 404);
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return this.sendErrorResponse(res, 'Invalid password', 400);
            }

            const payload: PayloadType = {
                id: user.id,
                email: user.email,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: pass, ...rest } = user;

            return this.sendSuccessResponse(
                res,
                'User logged in',
                { token: accessToken, refreshToken: refreshToken, user: rest },
                200
            );
        } catch (error) {
            return this.sendErrorResponse(
                res,
                'Something went wrong',
                500,
                error
            );
        }
    }

    private async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }
}
