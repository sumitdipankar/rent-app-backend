import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../../../logger'
import ResponseHelper from '../../../helpers/responseHelper';
import { sendMail } from '../../../services/mailService';
import { sendOtpMail } from '../../../services/otpMailService';

const prisma = new PrismaClient();

const register = async (request: Request, response: Response) => {
    const { name, email, password, role } = request.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) return response.status(400).json({ message: 'Email already in use' });

        const userRole = await prisma.role.findUnique({ where: { id: role } });
        if (!userRole) return response.status(400).json({ message: 'Invalid role provided' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id: userRole.id,
            },
        });

        logger.info('New user registered: ID=%d, Email=%s, Role=%s', newUser.id, newUser.email, role);

        await sendMail({
            to: email,
            subject: "Registered Successful 🎉",
            template: "welcome",
            context: { name: newUser.name },
        });

        return ResponseHelper.sendResponse(
            response,
            newUser,
            'User registered successfully',
            201
        );
    } catch (error) {
        logger.error('Register Error: %o', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            logger.warn('Login failed for email: %s - User not found', email);
            return response.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn('Login failed for email: %s - Invalid password', email);
            return response.status(401).json({ message: 'Invalid credentials' });
        }

        const permissions = user.role.permissions.map(p => p.permission.name);

        const token = jwt.sign({
            userId: user.id,
            role: user.role.name,
            permissions
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        logger.info('User logged in: ID=%d, Email=%s', user.id, user.email);

        await sendMail({
            to: "sumit.dipanker@payomatix.com",
            subject: "Login Successful 🎉",
            template: "welcome",
            context: { name: user.name },
        });
        logger.info('Login email sent to: %s', "sumit.dipanker@payomatix.com");
        return ResponseHelper.sendResponse(
            response,
            {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                    permissions
                }
            },
            'User logged in successfully',
            200
        );
    } catch (error) {
        logger.error('Login Error: %o', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};


// Generate random 6-digit OTP
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Request OTP
export const requestOtp = async (request: Request, response: Response) => {
    const { email } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return response.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await prisma.user.update({
        where: { email },
        data: { otp, otp_expires_at: expiry.toISOString() },
    });

    await sendOtpMail(email, otp);

    response.json({ message: "OTP sent to your email" });
};

// 2. Verify OTP
export const verifyOtp = async (request: Request, response: Response) => {
    const { email, otp } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otp_expires_at)
        return response.status(400).json({ message: "Invalid request" });

    if (user.otp !== otp) return response.status(400).json({ message: "Invalid OTP" });

    if (user.otp_expires_at < new Date().toISOString())
        return response.status(400).json({ message: "OTP expired" });

    // Mark as verified
    await prisma.user.update({
        where: { email },
        data: { otp_verified: true },
    });

    response.json({ message: "OTP verified successfully" });
};

// 3. Reset Password
export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otp_verified) return res.status(400).json({ message: "OTP not verified" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, otp: null, otp_expires_at: null, otp_verified: false },
    });
    sendMail({
        to: email,
        subject: "Password Reset Successful",
        template: "password-reset",
        context: { name: user.name },
    });
    logger.info('Password reset successful for email: %s', email);
    res.json({ message: "Password reset successful" });
};

module.exports = {
    register,
    login,
    requestOtp,
    verifyOtp,
    resetPassword
};
