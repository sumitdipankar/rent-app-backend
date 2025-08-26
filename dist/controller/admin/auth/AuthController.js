"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.requestOtp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../../logger"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const mailService_1 = require("../../../services/mailService");
const otpMailService_1 = require("../../../services/otpMailService");
const prisma = new client_1.PrismaClient();
const register = async (request, response) => {
    const { name, email, password, role } = request.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return response.status(400).json({ message: 'Email already in use' });
        const userRole = await prisma.role.findUnique({ where: { id: role } });
        if (!userRole)
            return response.status(400).json({ message: 'Invalid role provided' });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id: userRole.id,
            },
        });
        logger_1.default.info('New user registered: ID=%d, Email=%s, Role=%s', newUser.id, newUser.email, role);
        await (0, mailService_1.sendMail)({
            to: email,
            subject: "Registered Successful 🎉",
            template: "welcome",
            context: { name: newUser.name },
        });
        return responseHelper_1.default.sendResponse(response, newUser, 'User registered successfully', 201);
    }
    catch (error) {
        logger_1.default.error('Register Error: %o', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};
const login = async (request, response) => {
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
            logger_1.default.warn('Login failed for email: %s - User not found', email);
            return response.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            logger_1.default.warn('Login failed for email: %s - Invalid password', email);
            return response.status(401).json({ message: 'Invalid credentials' });
        }
        const permissions = user.role.permissions.map(p => p.permission.name);
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role.name,
            permissions
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        logger_1.default.info('User logged in: ID=%d, Email=%s', user.id, user.email);
        await (0, mailService_1.sendMail)({
            to: "sumit.dipanker@payomatix.com",
            subject: "Login Successful 🎉",
            template: "welcome",
            context: { name: user.name },
        });
        logger_1.default.info('Login email sent to: %s', "sumit.dipanker@payomatix.com");
        return responseHelper_1.default.sendResponse(response, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                permissions
            }
        }, 'User logged in successfully', 200);
    }
    catch (error) {
        logger_1.default.error('Login Error: %o', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const requestOtp = async (request, response) => {
    const { email } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return response.status(404).json({ message: "User not found" });
    const otp = generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    await prisma.user.update({
        where: { email },
        data: { otp, otp_expires_at: expiry.toISOString() },
    });
    await (0, otpMailService_1.sendOtpMail)(email, otp);
    response.json({ message: "OTP sent to your email" });
};
exports.requestOtp = requestOtp;
const verifyOtp = async (request, response) => {
    const { email, otp } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otp || !user.otp_expires_at)
        return response.status(400).json({ message: "Invalid request" });
    if (user.otp !== otp)
        return response.status(400).json({ message: "Invalid OTP" });
    if (user.otp_expires_at < new Date().toISOString())
        return response.status(400).json({ message: "OTP expired" });
    await prisma.user.update({
        where: { email },
        data: { otp_verified: true },
    });
    response.json({ message: "OTP verified successfully" });
};
exports.verifyOtp = verifyOtp;
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (!user.otp_verified)
        return res.status(400).json({ message: "OTP not verified" });
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, otp: null, otp_expires_at: null, otp_verified: false },
    });
    (0, mailService_1.sendMail)({
        to: email,
        subject: "Password Reset Successful",
        template: "password-reset",
        context: { name: user.name },
    });
    logger_1.default.info('Password reset successful for email: %s', email);
    res.json({ message: "Password reset successful" });
};
exports.resetPassword = resetPassword;
module.exports = {
    register,
    login,
    requestOtp: exports.requestOtp,
    verifyOtp: exports.verifyOtp,
    resetPassword: exports.resetPassword
};
//# sourceMappingURL=AuthController.js.map