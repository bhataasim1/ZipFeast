import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { InputValidator } from '../../utils/InputValidator';
import { UploadFile, UserProfileType } from '../../types/types';



export class UserProfileController {
    public async getUserProfile(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userId = req.user?.id;
        console.log('User ID:', userId);
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userId = req.user?.id;
        console.log('User ID:', userId);
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
                    id: Number(userId),
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
                        id: Number(userId),
                    },
                    data: user,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        city: true,
                        pincode: true,
                        state: true,
                    },
                });

                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'User updated successfully',
                            updatedUser,
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userId = req.user?.id;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId),
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

            const newAvatar = req.file as UploadFile;
            // console.log('New Avatar:', newAvatar);
            if (!newAvatar) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Please Upload a valid image',
                        },
                        400
                    )
                );
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: Number(userId),
                },
                data: {
                    avatar: newAvatar.location,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    address: true,
                    city: true,
                    pincode: true,
                    state: true,
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
