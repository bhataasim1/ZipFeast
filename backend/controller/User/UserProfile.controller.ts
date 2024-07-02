import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { InputValidator } from '../../utils/InputValidator';
import { UploadFile, UserProfileType } from '../../types/types';

export class UserProfileController {
    private prisma;

    constructor() {
        this.prisma = prisma;
    }

    public getUserProfile = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);
        // console.log('User ID:', userId);

        if (!userId) return this.sendErrorResponse(res, 'User not found', 404);

        try {
            const user = await this.findUserById(userId);
            if (!user) {
                return this.sendErrorResponse(res, 'User not found', 404);
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, role, createdAt, updatedAt, ...rest } = user;
            return this.sendSuccessResponse(res, 'User profile', rest);
        } catch (error) {
            return this.sendErrorResponse(
                res,
                'Something went wrong',
                500,
                error
            );
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);
        // console.log('User ID:', userId);

        if (!userId) {
            return this.sendErrorResponse(res, 'User not found', 404);
        }

        const userProfileData: UserProfileType = req.body;

        try {
            const existingUser = await this.findUserById(userId);
            if (!existingUser) {
                return this.sendErrorResponse(res, 'User does not exist', 401);
            }

            const validator = new InputValidator(req);
            this.validateUserProfile(validator);

            await validator.validate(req, res, async () => {
                const updatedUser = await this.updateUserProfile(
                    userId,
                    userProfileData
                );
                return this.sendSuccessResponse(
                    res,
                    'User updated successfully',
                    updatedUser
                );
            });
        } catch (error) {
            return this.sendErrorResponse(res, 'An error occurred', 500, error);
        }
    };

    public uploadUserAvatar = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        if (!userId) {
            return this.sendErrorResponse(res, 'User not found', 404);
        }

        try {
            const user = await this.findUserById(userId);
            if (!user) {
                return this.sendErrorResponse(res, 'User not found', 404);
            }

            const newAvatar = req.file as UploadFile;
            // console.log('New Avatar:', newAvatar);
            if (!newAvatar) {
                return this.sendErrorResponse(
                    res,
                    'Please upload a valid image',
                    400
                );
            }

            const updatedUser = await this.updateUserAvatar(
                userId,
                newAvatar.location
            );
            return this.sendSuccessResponse(
                res,
                'Avatar uploaded successfully',
                updatedUser
            );
        } catch (error) {
            console.error('Error uploading avatar:', error);
            return this.sendErrorResponse(
                res,
                'Something went wrong',
                500,
                error
            );
        }
    };

    private getUserId(req: Request): number | undefined {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return req.user?.id;
    }

    private async findUserById(userId: number) {
        return await this.prisma.user.findUnique({
            where: { id: Number(userId) },
            include: { orders: true, Favorite: true },
        });
    }

    private async updateUserProfile(
        userId: number,
        userProfileData: UserProfileType
    ) {
        return await this.prisma.user.update({
            where: { id: Number(userId) },
            data: userProfileData,
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
    }

    private async updateUserAvatar(userId: number, avatarLocation: string) {
        return await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { avatar: avatarLocation },
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
    }

    private sendSuccessResponse(
        res: Response,
        message: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        status: number = 200
    ) {
        return res.send(
            new ApiResponse({ status: 'success', message, data }, status)
        );
    }

    private sendErrorResponse(
        res: Response,
        message: string,
        status: number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error?: any
    ) {
        return res.send(
            new ApiResponse({ status: 'error', message, error }, status)
        );
    }

    private validateUserProfile(validator: InputValidator) {
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
    }
}
