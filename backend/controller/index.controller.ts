import express, { Request, Response, Router } from 'express';
import { ApiResponse } from '../middleware';
import { prisma } from '../prisma/Schema';

export class IndexController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.inititlizeRoutes(this, this.router);
    }

    public async getMerchants(req: Request, res: Response) {
        const merchant = await prisma.merchant.findMany({
            include: {
                products: true,
            },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, ...merchantData } = merchant;
        //TODO: This line is not working as expected. this is returning the merchant data with password etc

        res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'Merchant fetched successfully',
                    merchantData,
                },
                200
            )
        );
    }

    public async getMerchantByName(req: Request, res: Response) {
        ///TODO: Implement the Type Checking here
        const { storeName } = req.params;
        const merchant = await prisma.merchant.findUnique({
            where: {
                storeName,
            },
            include: {
                products: true,
            },
        });
        if (!merchant) {
            res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Merchant not found',
                    },
                    404
                )
            );
            return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, ...merchantData } = merchant;

        res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'Merchant fetched successfully',
                    merchantData,
                },
                200
            )
        );
    }

    public inititlizeRoutes(controller: IndexController, router: Router) {
        router.get('/merchants', controller.getMerchants);
        router.get('/merchant/:storeName', controller.getMerchantByName);
    }
}
