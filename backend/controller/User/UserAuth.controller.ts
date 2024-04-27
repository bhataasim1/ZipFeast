import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import bcrypt from 'bcrypt';
import {
    ApiResponse,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../middleware';
import { BaseInputType, UserProfileType, PayloadType } from '../../types/types';

export class UserAuthController {
    public async registerUser(req: Request, res: Response) {
        const {
            name,
            email,
            password,
            confirmPassword,
            role,
        }: UserProfileType = req.body;

        if (!name || !email || !password || !confirmPassword) {
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
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'User already exists',
                        },
                        401
                    )
                );
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User created successfully',
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

    public async loginUser(req: Request, res: Response) {
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
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!existingUser) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid email or Password',
                        },
                        401
                    )
                );

            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
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
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: existingUser.id,
                },
            });

            const {
                //eslint-disable-next-line
                password: pass,
                //eslint-disable-next-line
                createdAt,
                //eslint-disable-next-line
                updatedAt,
                //eslint-disable-next-line
                role,
                ...user
            } = existingUser;

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User logged in successfully',
                        user,
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

    public async logOutUser(req: Request, res: Response) {
        let accessToken: string = req.body.token; // in body use 'token: "accessToken"'
        if (!accessToken && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            const tokenParts = authHeader.split(' ');

            if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
                accessToken = tokenParts[1];
            }
        }

        if (!accessToken) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Refresh Token is required',
                    },
                    400
                )
            );
        }
        await prisma.refreshToken
            .delete({
                where: {
                    token: accessToken,
                },
            })
            .then(() => {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'User logged out successfully',
                        },
                        200
                    )
                );
            })
            .catch(() => {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid Token',
                        },
                        500
                    )
                );
            });
    }

    public async refreshToken(req: Request, res: Response) {
        let token: string = req.body.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            const tokenParts = authHeader.split(' ');

            if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
                token = tokenParts[1];
            }
        }

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
