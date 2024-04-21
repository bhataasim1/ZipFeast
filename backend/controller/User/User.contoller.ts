import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware/apiResponse.middleware';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../middleware';

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
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
                    message: 'Passwords do not match',
                },
                400
            )
        );
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            res.send(
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
        res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'User created successfully',
                },
                201
            )
        );
        //eslint-disable-next-line
    } catch (error: any) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: error.message,
                },
                500
            )
        );
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Email and Password are required',
                },
                400
            )
        );
        return;
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!existingUser) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Invalid email or Password',
                },
                401
            )
        );
        return;
    }
    const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
    );
    if (!isPasswordValid) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Invalid email or Password',
                },
                401
            )
        );
        return;
    }
    try {
        const payload = {
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

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, role, ...user } =
            existingUser;
        res.send(
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
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: error.message,
                },
                500
            )
        );
        return;
    }
};

export async function logOut(req: Request, res: Response) {
    let accessToken: string = req.body.token; // in body use 'token: "accessToken"'
    if (!accessToken && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const tokenParts = authHeader.split(' ');

        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            accessToken = tokenParts[1];
        }
    }

    if (!accessToken) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Refresh Token is required',
                },
                400
            )
        );
        return;
    }
    await prisma.refreshToken
        .delete({
            where: {
                token: accessToken,
            },
        })
        .then(() => {
            res.send(
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
            res.send(
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

export async function refreshToken(req: Request, res: Response) {
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
