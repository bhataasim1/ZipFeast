import express, { Request, Response, Router } from 'express';
import { prisma } from '../../prisma/Schema';
import bcrypt from 'bcrypt';
import { ApiResponse, generateAccessToken } from '../../middleware';
import { BaseInputType, MerchantProfileType, PayloadType } from '../../types';
import { InputValidator } from '../../utils/InputValidator';

export class MerchantController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.inititlizeRoutes(this, this.router);
    }

    public async registerMerchant(req: Request, res: Response) {
        const {
            storeName,
            name,
            email,
            password,
            confirmPassword,
        }: MerchantProfileType = req.body;

        if (!storeName || !name || !email || !password || !confirmPassword) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
            return;
        }

        if (password !== confirmPassword) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'password and confirm password do not match',
                    },
                    400
                )
            );
            return;
        }

        try {
            const existingUser = await prisma.merchant.findFirst({
                where: {
                    OR: [{ email }, { storeName }],
                },
            });

            if (existingUser) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'User already exists',
                        },
                        401
                    )
                );
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.merchant.create({
                data: {
                    storeName,
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User created successfully',
                    },
                    201
                )
            );
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

    public async loginMerchant(req: Request, res: Response) {
        ///TODO: why the error doesent show up when name is missing from the BaseInputType
        const { email, password }: BaseInputType = req.body;

        if (!email || !password) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
            return;
        }

        try {
            const existingUser = await prisma.merchant.findUnique({
                where: {
                    email: email,
                },
            });

            if (!existingUser) {
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

            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!isPasswordValid) {
                res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Invalid credentials',
                        },
                        401
                    )
                );
                return;
            }

            const payload: PayloadType = {
                id: existingUser.id,
                email: existingUser.email,
            };

            const accessToken = generateAccessToken(payload);

            const {
                //eslint-disable-next-line
                password: pass,
                //eslint-disable-next-line
                createdAt,
                //eslint-disable-next-line
                updatedAt,
                ...merchant
            } = existingUser;

            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User logged in successfully',
                        merchant,
                        accessToken,
                    },
                    200
                )
            );
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
                if (req.file) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    merchant.avatar = req.file.path;
                }

                await prisma.merchant.update({
                    where: {
                        id: Number(id),
                    },
                    data: merchant,
                });
            });

            res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Merchant updated successfully',
                    },
                    200
                )
            );
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

    private inititlizeRoutes(instance: MerchantController, router: Router) {
        router.post('/register', instance.registerMerchant);
        router.post('/login', instance.loginMerchant);
        router.post('/profile/update/:id', instance.updateMerchant);
    }
}
