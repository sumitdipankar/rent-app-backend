"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        return response.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: role
            }
        });
    }
    catch (error) {
        console.error('Register Error:', error);
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
        if (!user)
            return response.status(404).json({ message: 'User not found' });
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return response.status(401).json({ message: 'Invalid credentials' });
        const permissions = user.role.permissions.map(p => p.permission.name);
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role.name,
            permissions
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return response.status(200).json({
            success: true,
            status: 200,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                permissions
            }
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
};
module.exports = {
    register,
    login
};
//# sourceMappingURL=AuthController.js.map