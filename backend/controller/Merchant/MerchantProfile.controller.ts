import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { MerchantProfileType, UploadFile } from '../../types/types';
import { InputValidator } from '../../utils/InputValidator';

export class MerchantProfileController {
    public async updateMerchant(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const merchantId = req.user?.id;
        console.log('Merchant ID:', merchantId);
        const {
            storeName,
            name,
            email,
            phone,
            address,
            city,
            pincode,
            state,
        }: MerchantProfileType = req.body;

        try {
            const existingMerchant = await prisma.merchant.findUnique({
                where: {
                    id: Number(merchantId),
                },
            });

            if (!existingMerchant) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Merchant does not exist',
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
                const merchant = await prisma.merchant.update({
                    where: {
                        id: Number(merchantId),
                    },
                    data: {
                        storeName,
                        name,
                        email,
                        phone,
                        address,
                        city,
                        pincode,
                        state,
                    },
                    select: {
                        id: true,
                        storeName: true,
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
                            message: 'Merchant updated successfully',
                            merchant: merchant,
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

    public async uploadMerchantAvatar(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const merchantId = req.user?.id;

        try {
            const merchant = await prisma.merchant.findUnique({
                where: {
                    id: Number(merchantId),
                },
            });

            if (!merchant) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Merchant not found',
                });
            }

            const newAvatar = req.file as UploadFile;
            if (!newAvatar) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Please Upload a Valid Image',
                        },
                        401
                    )
                );
            }

            const updatedMerchant = await prisma.merchant.update({
                where: {
                    id: Number(merchantId),
                },
                data: {
                    avatar: newAvatar.location,
                },
                select: {
                    id: true,
                    storeName: true,
                    name: true,
                    email: true,
                    avatar: true,
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
                        message: 'Avatar uploaded successfully',
                        data: updatedMerchant,
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
