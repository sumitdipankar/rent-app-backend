import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function userSeeder() {
    try {
        const password = await bcrypt.hash('password123', 10);

        const adminRole = await prisma.role.findUnique({
            where: { name: 'admin' }
        });

        if (!adminRole) {
            console.error(' Admin role not found. Please run roleSeeder first.');
            return;
        }

        console.log(' Creating user with role ID:', adminRole.id);

        const user = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {
                password,
                name: 'Super Admin',
                status: true,
                role_id: adminRole.id
            },
            create: {
                name: 'Super Admin',
                email: 'admin@example.com',
                password,
                status: true,
                role_id: adminRole.id
            }
        });

        console.log(' Admin user created or updated:', user.email);
    } catch (err) {
        console.error(' Error creating admin user:', err);
    } finally {
        await prisma.$disconnect();
    }
}

userSeeder();
