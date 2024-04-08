import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware/apiResponse.middleware';
import bcrypt from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../../middleware/auth.midleware';

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
                roleId: role || 3,
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
            role: existingUser.roleId,
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
        const { password, createdAt, updatedAt, roleId, ...user } =
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
    let refreshToken: string = req.body.token; // in body use 'token: "refreshToken"'
    if (!refreshToken && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const tokenParts = authHeader.split(' ');

        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            refreshToken = tokenParts[1];
        }
    }

    if (!refreshToken) {
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
                token: refreshToken,
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
    const refreshToken: string = req.body.token;

    if (!refreshToken) {
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
    const existingRefreshToken = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken,
        },
    });

    if (!existingRefreshToken) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Invalid Refresh Token',
                },
                401
            )
        );
        return;
    }

    const payload = verifyRefreshToken(refreshToken);
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
