import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import bcrypt from 'bcrypt';
import {
    ApiResponse,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../middleware';
import { BaseInputType, MerchantProfileType, PayloadType } from '../../types/types';

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
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
        }

        if (password !== confirmPassword) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'password and confirm password do not match',
                    },
                    400
                )
            );
        }

        try {
            const existingUser = await prisma.merchant.findFirst({
                where: {
                    OR: [{ email }, { storeName }],
                },
            });

            if(existingUser?.storeName === storeName) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Store name already exists',
                        },
                        401
                    )
                );
            }

            if (existingUser?.email === email) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Email already exists',
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

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Merchant created successfully',
                    },
                    201
                )
            );
        } catch (error) {
            return res.send(
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
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
        }

        try {
            const existingMerchant = await prisma.merchant.findUnique({
                where: {
                    email: email,
                },
            });

            if (!existingMerchant) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid credentials',
                        },
                        401
                    )
                );
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingMerchant.password
            );

            if (!isPasswordValid) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid credentials',
                        },
                        401
                    )
                );
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

            return res.send(
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
            return res.send(
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
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Access Token is required',
                    },
                    400
                )
            );
        }
        const existingAccessToken = await prisma.refreshToken.findFirst({
            where: {
                token: token,
            },
        });

        if (!existingAccessToken) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Invalid Access Token',
                    },
                    401
                )
            );
        }

        const payload = verifyRefreshToken(token);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const accessToken = generateAccessToken(payload);
        return res.send(
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
