import { prisma } from '../prisma/Schema';

export const validateToken = async (
    authorizationHeader: string | undefined,
    userId: number
): Promise<boolean> => {
    if (!authorizationHeader) {
        return false;
    }

    const accessToken = authorizationHeader.replace('Bearer ', '');

    try {
        const existingAccessToken = await prisma.refreshToken.findFirst({
            where: {
                token: accessToken,
                userId: userId,
            },
        });

        return !!existingAccessToken; // Returns true if the access token exists
    } catch (error) {
        return false;
    }
};
