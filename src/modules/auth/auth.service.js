import { prisma } from '../../utils/prisma.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async ({ name, email, password, phone, address }) => {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) throw new Error("Email already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hash, phone, address, role: "USER" },
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { user, token };
};
