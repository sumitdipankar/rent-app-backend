"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../../logger"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const mailService_1 = require("../../../services/mailService");
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
            to: email,
            subject: "Login Successful 🎉",
            template: "welcome",
            context: { name: user.name },
        });
        logger_1.default.info('Login email sent to: %s', email);
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
module.exports = {
    register,
    login
};
//# sourceMappingURL=AuthController.js.map