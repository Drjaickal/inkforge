import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.ts";

export const register = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "WRITER"
            }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

export const login = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};