import { Request, Response } from 'express';
import { HomeServicesAuthController } from './HomeServicesAuth.controller';
import { prisma } from '../../prisma/Schema';
import { UploadFile } from '../../types';

export class HomeServiceProfileController extends HomeServicesAuthController {
    constructor() {
        super();
        this.updateProfile = this.updateProfile.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    async getProfile(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            return this.sendSuccessResponse(res, 'Unauthorized access', 401);
        }

        try {
            const homeService = await prisma.serviceProvider.findUnique({
                where: {
                    id: Number(userId),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    city: true,
                    pincode: true,
                    state: true,
                    avatar: true,
                    serviceType: true,
                    price: true,
                },
            });

            if (!homeService) {
                return this.sendSuccessResponse(res, 'User Not Found', 404);
            }

            return this.sendSuccessResponse(
                res,
                'User Found',
                homeService,
                200
            );
        } catch (error) {
            return this.sendErrorResponse(res, 'An error occurred', 500, error);
        }
    }

    async updateProfile(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            return this.sendSuccessResponse(res, 'Unauthorized access', 401);
        }

        const { name, address, price, city, pincode, state } = req.body;

        const avatar = req.file as UploadFile;
        // console.log('Avatar:', avatar);

        try {
            const homeService = await prisma.serviceProvider.findUnique({
                where: {
                    id: Number(userId),
                },
            });

            if (!homeService) {
                return this.sendSuccessResponse(res, 'User Not Found', 404);
            }

            const user = await prisma.serviceProvider.update({
                where: {
                    id: Number(userId),
                },
                data: {
                    name,
                    address,
                    city,
                    price,
                    pincode,
                    state,
                    avatar: avatar?.location,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    serviceType: true,
                    address: true,
                    city: true,
                    pincode: true,
                    state: true,
                },
            });

            return this.sendSuccessResponse(
                res,
                'Profile updated successfully',
                user,
                200
            );
        } catch (error) {
            return this.sendErrorResponse(res, 'An error occurred', 500, error);
        }
    }
}
