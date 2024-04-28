import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { MerchantProfileType } from '../../types/types';
import { InputValidator } from '../../utils/InputValidator';
import { BaseEnvironment } from '../../Environment';
import fs from 'fs';

const env = new BaseEnvironment();

export class MerchantProfileController {
    public async updateMerchant(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const merchantId = req.user?.id
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
                //TODO: Implement the Type Checking here
                const merchant = {
                    storeName,
                    name,
                    email,
                    phone,
                    address,
                    city,
                    pincode,
                    state,
                };

                const m = await prisma.merchant.update({
                    where: {
                        id: Number(merchantId),
                    },
                    data: merchant,
                });
                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Merchant updated successfully',
                            m,
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
        const merchantId = req.user?.id

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

            const newAvatar = req.file?.filename;
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

            if (merchant.avatar) {
                const existingAvatar = merchant.avatar;
                fs.unlinkSync(`${env.UPLOAD_DIR}/avatar/${existingAvatar}`);
            }

            const updatedMerchant = await prisma.merchant.update({
                where: {
                    id: Number(merchantId),
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
