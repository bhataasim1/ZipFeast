import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { InputValidator } from '../../utils/InputValidator';
import { BaseEnvironment } from '../../Environment';
import fs from 'fs';
import { UserProfileType } from '../../types/types';

const env = new BaseEnvironment();

export class UserProfileController {
    public async getUserProfile(req: Request, res: Response) {
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
                return res.send(
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
            const { password, role, createdAt, updatedAt, ...rest } = user;

            return res.send(
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
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Something went wrong',
                    },
                    500
                )
            );
        }
    }

    public async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            address,
            city,
            pincode,
            state,
        }: UserProfileType = req.body;

        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!existingUser) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'User does not exist',
                        },
                        401
                    )
                );
            }

            const validator = new InputValidator(req);
            validator
                .validateStoreName()
                .validateName()
                .ValidateEmail()
                .validatePassword()
                .validatePhone()
                .validateAddress()
                .validateCity()
                .validateState()
                .validatePincode();

            await validator.validate(req, res, async () => {
                //TODO: Implement the Type Checking here
                const user = {
                    name,
                    email,
                    phone,
                    address,
                    city,
                    pincode,
                    state,
                };

                const updatedUser = await prisma.user.update({
                    where: {
                        id: Number(id),
                    },
                    data: user,
                });

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, createdAt, updatedAt, role, ...rest } =
                    updatedUser;
                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'User updated successfully',
                            rest,
                        },
                        200
                    )
                );
            });
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

    public async uploadUserAvatar(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!user) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'User not found',
                        },
                        404
                    )
                );
            }

            const newAvatar = req.file?.filename;
            if (!newAvatar) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Please Upload a valid image',
                        },
                        401
                    )
                );
            }

            if (user.avatar) {
                const existingAvatar = user.avatar;
                fs.unlinkSync(`${env.UPLOAD_DIR}/avatar/${existingAvatar}`);
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: Number(id),
                },
                data: {
                    avatar: newAvatar,
                },
            });

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Avatar uploaded successfully',
                        data: updatedUser,
                    },
                    200
                )
            );
        } catch (error) {
            console.error('Error uploading avatar:', error);
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Something Went Wrong',
                        error,
                    },
                    500
                )
            );
        }
    }
}
