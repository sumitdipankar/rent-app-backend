import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function roleSeeder() {
    const roles = ['admin', 'vendor', 'customer'];

    await Promise.all(
        roles.map((role) =>
            prisma.role.upsert({
                where: { name: role },
                update: {},
                create: { name: role }
            })
        )
    );

    console.log(" Roles seeded: admin, vendor, customer");
}

roleSeeder()
    .then(() => {
        console.log('Seeding completed');
    })
    .catch((err) => {
        console.error(' Seeding failed:', err);
    })
    .finally(() => prisma.$disconnect());
