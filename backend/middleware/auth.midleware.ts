import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import { BaseEnvironment } from '../Environment';
import jwt from 'jsonwebtoken';
import { PayloadType } from '../types';

const env = new BaseEnvironment();

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: env.ACCESS_TOKEN_SECRET,
            },
            (payload, done) => {
                if (!payload) {
                    return done(null, false);
                }
                return done(null, payload);
            }
        )
    );
    passport.authenticate('jwt', { session: false });
    next();
};

export const generateAccessToken = (payload: PayloadType) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_LIFE,
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyAccessToken = (token: any) => {
    return jwt.verify(
        token,
        env.ACCESS_TOKEN_SECRET,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, user: any) => {
            if (err) {
                return err;
            }
            return user;
        }
    );
};

export const auth = passport.authenticate('jwt', { session: false });
