import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware/apiResponse.middleware';
import { Request, Response } from 'express';
import { userAuth } from '../../middleware/UserProtectedRoutes.middleware';

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            include: {
                orders: true,
                Favorite: true,
            },
        });
        if (!user) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'User not found',
                    },
                    404
                )
            );
            return;
        }

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, roleId, createdAt, updatedAt, ...rest } = user;

        res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'User profile',
                    data: rest,
                },
                200
            )
        );
    } catch (error) {
        res.send(
            new ApiResponse(
                {
                    status: 'error',
                    message: 'Something went wrong',
                },
                500
            )
        );
    }
};

export const protectedRoutes = [userAuth]
