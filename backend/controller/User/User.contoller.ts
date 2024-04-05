import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';

export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user = await prisma.user.create(data);
        res.status(201).json({
            message: 'User Created Successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data,
        });
        res.status(200).json({
            message: 'User Updated Successfully',
            user,
        });
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email,
                password,
            },
        });
        if (!user) {
            res.status(404).json({ message: 'Invalid username or Password' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};
