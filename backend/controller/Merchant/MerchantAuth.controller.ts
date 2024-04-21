import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import bcrypt from 'bcrypt';
import {
    ApiResponse,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../middleware';
import { BaseInputType, MerchantProfileType, PayloadType } from '../../types';

export class MerchantAuthController {
    public async registerMerchant(req: Request, res: Response) {
        const {
            storeName,
            name,
            email,
            password,
            confirmPassword,
        }: MerchantProfileType = req.body;

        if (!storeName || !name || !email || !password || !confirmPassword) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
            return;
        }

        if (password !== confirmPassword) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'password and confirm password do not match',
                    },
                    400
                )
            );
            return;
        }

        try {
            const existingUser = await prisma.merchant.findFirst({
                where: {
                    OR: [{ email }, { storeName }],
                },
            });

            if (existingUser) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Merchant already exists',
                        },
                        401
                    )
                );
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.merchant.create({
                data: {
                    storeName,
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Merchant created successfully',
                    },
                    201
                )
            );
        } catch (error) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'An error occurred',
                        error: error,
                    },
                    500
                )
            );
        }
    }

    public async loginMerchant(req: Request, res: Response) {
        ///TODO: why the error doesent show up when name is missing from the BaseInputType
        const { email, password }: BaseInputType = req.body;

        if (!email || !password) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
            return;
        }

        try {
            const existingMerchant = await prisma.merchant.findUnique({
                where: {
                    email: email,
                },
            });

            if (!existingMerchant) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Merchant does not exist',
                        },
                        401
                    )
                );
                return;
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingMerchant.password
            );

            if (!isPasswordValid) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid credentials',
                        },
                        401
                    )
                );
                return;
            }

            const payload: PayloadType = {
                id: existingMerchant.id,
                email: existingMerchant.email,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    merchantId: existingMerchant.id,
                },
            });

            const {
                //eslint-disable-next-line
                password: pass,
                //eslint-disable-next-line
                createdAt,
                //eslint-disable-next-line
                updatedAt,
                ...merchant
            } = existingMerchant;

            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User logged in successfully',
                        merchant,
                        accessToken,
                        refreshToken,
                    },
                    200
                )
            );
        } catch (error) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'An error occurred',
                        error: error,
                    },
                    500
                )
            );
        }
    }

    public async refreshToken(req: Request, res: Response) {
        const token: string = req.body.token;

        if (!token) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Access Token is required',
                    },
                    400
                )
            );
            return;
        }
        const existingAccessToken = await prisma.refreshToken.findFirst({
            where: {
                token: token,
            },
        });

        if (!existingAccessToken) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Invalid Access Token',
                    },
                    401
                )
            );
            return;
        }

        const payload = verifyRefreshToken(token);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const accessToken = generateAccessToken(payload);
        res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'Access Token generated successfully',
                    accessToken,
                },
                200
            )
        );
    }
}
