import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware/apiResponse.middleware';
import { Request, Response } from 'express';
import { userAuth } from '../../middleware/ProtectedRoutes.middleware';
import UserProfileValidator from '../../utils/UserProfileValidator';

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

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const {
        name,
        email,
        password,
        avatar,
        phone,
        address,
        city,
        state,
        pincode,
    } = req.body;
    try {
        const validator = new UserProfileValidator(req);
        validator
            .validateName()
            .ValidateEmail()
            .validatePassword()
            .validateAvatar()
            .validatePhone()
            .validateAddress()
            .validateCity()
            .validateState()
            .validatePincode();

        await validator.validate(req, res, async () => {
            const user = await prisma.user.update({
                where: {
                    id: Number(userId),
                },
                data: {
                    name,
                    email,
                    password,
                    avatar,
                    phone,
                    address,
                    city,
                    state,
                    pincode,
                },
            });
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: pass, roleId, createdAt, updatedAt, ...rest } = user;
    
            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User profile updated',
                        data: rest,
                    },
                    200
                )
            );
        });

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

export const protectedRoutes = [userAuth];
