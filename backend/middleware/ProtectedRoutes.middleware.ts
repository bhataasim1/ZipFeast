import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { BaseEnvironment } from '../Environment';
import { prisma } from '../prisma/Schema';
import { ApiResponse } from './apiResponse.middleware';
import { NextFunction, Request, Response } from 'express';

const env = new BaseEnvironment();

const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.ACCESS_TOKEN_SECRET,
};

passport.use(
    'user-jwt',
    new JwtStrategy(JWTOptions, async (payload, done) => {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(payload.id),
            },
        });
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    })
);

passport.use(
    'merchant-jwt',
    new JwtStrategy(JWTOptions, async (payload, done) => {
        const merchant = await prisma.merchant.findUnique({
            where: {
                id: Number(payload.id),
            },
        });
        if (!merchant) {
            return done(null, false);
        }
        return done(null, merchant);
    })
);

export const authorizedUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const authenticatedUserId = req.user.id;
        const requestedUserId = parseInt(req.params.id);

        if (!authenticatedUserId) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Unauthorized: User not authenticated',
                    },
                    401
                )
            );
        }

        if (authenticatedUserId !== requestedUserId) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message:
                            'Forbidden: You do not have permission to access this resource',
                    },
                    401
                )
            );
        }
        next();
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
};

export const userAuth = passport.authenticate('user-jwt', { session: false });
export const merchantAuth = passport.authenticate('merchant-jwt', {
    session: false,
});
