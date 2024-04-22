import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse, upload } from '../../middleware';
import { InputValidator } from '../../utils/InputValidator';
import { BaseEnvironment } from '../../Environment';
import fs from 'fs';
import { UserProfileType } from '../../types';

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
            const { password, role, createdAt, updatedAt, ...rest } = user;

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
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'User does not exist',
                        },
                        401
                    )
                );
                return;
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
                res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Merchant updated successfully',
                            updatedUser,
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

            const uploadAvatar = upload('avatar');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            uploadAvatar(req, res, async (err: any) => {
                if (err) {
                    res.send(
                        new ApiResponse(
                            {
                                status: 'error',
                                message: 'An error occurred',
                            },
                            500
                        )
                    );
                }

                if (!req.file) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Please upload an image file',
                    });
                }
                ///TODO: I dont know when i use the new ApiResponse, the below avatar gives error

                const newAvatar = req.file.filename;

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

                res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Avatar uploaded successfully',
                            data: updatedUser,
                        },
                        200
                    )
                );
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            res.send(
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
