import { prisma } from '../../prisma/Schema';
import { Request, Response } from 'express';
import { ApiResponse, userAuth } from '../../middleware';
import { InputValidator } from '../../utils/InputValidator';
import { UserProfileType } from '../../types';
// import bcrypt from 'bcrypt';

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
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;

    const {
        name,
        email,
        // password,
        phone,
        address,
        city,
        state,
        pincode,
    }: UserProfileType = req.body;
    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const validator = new InputValidator(req);
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
            const userData = {
                name,
                email,
                // password,
                phone,
                address,
                city,
                state,
                pincode,
            };
            if (req.file) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                userData.avatar = req.file?.path;
            }
            const user = await prisma.user.update({
                where: {
                    id: Number(userId),
                },
                data: userData,
            });

            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                password: pass,
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                role,
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                createdAt,
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                updatedAt,
                ...rest
            } = user;

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
