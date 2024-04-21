import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse, upload } from '../../middleware';
import { MerchantProfileType } from '../../types';
import { InputValidator } from '../../utils/InputValidator';
import { BaseEnvironment } from '../../Environment';
import fs from 'fs';

const env = new BaseEnvironment();

export class MerchantProfileController {
    public async updateMerchant(req: Request, res: Response) {
        const { id } = req.params;
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
                    id: Number(id),
                },
            });

            if (!existingMerchant) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Merchant does not exist',
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
                        id: Number(id),
                    },
                    data: merchant,
                });
                res.send(
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

    public async uploadMerchantAvatar(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const merchant = await prisma.merchant.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!merchant) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Merchant not found',
                });
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

                if (merchant.avatar) {
                    const existingAvatar = merchant.avatar;
                    fs.unlinkSync(`${env.UPLOAD_DIR}/avatar/${existingAvatar}`);
                }

                const updatedMerchant = await prisma.merchant.update({
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
                            data: updatedMerchant,
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
