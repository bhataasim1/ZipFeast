import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { BaseEnvironment } from '../Environment';
import { prisma } from '../prisma/Schema';

const env = new BaseEnvironment();

const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.ACCESS_TOKEN_SECRET,
};

passport.use(
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

export const userAuth = passport.authenticate('jwt', { session: false });
