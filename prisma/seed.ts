import userSeeder from './seeder/userSeeder';
import roleSeeder from './seeder/roleSeeder';
import permissionSeeder from './seeder/permissionSeeder';
import rolePermissionSeeder from './seeder/rolePermissionSeeder';
import { Prisma } from '@prisma/client';

async function main() {
    console.log('Seeding database...');

    await userSeeder();
    await roleSeeder();
    await permissionSeeder();
    await rolePermissionSeeder();

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await Prisma.$disconnect();
    });