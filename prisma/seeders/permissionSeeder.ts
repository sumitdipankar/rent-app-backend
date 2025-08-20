// prisma/seeders/permissionSeeder.ts
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const modulePermissions: Record<string, string[]> = {
    role: ['role_list', 'role_create', 'role_edit', 'role_delete'],
    user: ['user_list', 'user_create', 'user_edit', 'user_delete'],
    country: ['country_list', 'country_create', 'country_edit', 'country_delete'],
    state: ['state_list', 'state_create', 'state_edit', 'state_delete'],
    district: ['district_list', 'district_create', 'district_edit', 'district_delete'],
    city: ['city_list', 'city_create', 'city_edit', 'city_delete'],
    category: ['category_list', 'category_create', 'category_edit', 'category_delete'],
    subCategory: ['subCategory_list', 'subCategory_create', 'subCategory_edit', 'subCategory_delete'],
    product: ['product_list', 'product_create', 'product_edit', 'product_delete'],
};


async function seedPermissions() {
    const permissions: string[] = [];

    for (const [module, actions] of Object.entries(modulePermissions)) {
        for (const action of actions) {
            permissions.push(`${module}.${action}`);
        }
    }

    await Promise.all(
        permissions.map((name) =>
            prisma.permission.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );

    console.log(' Permissions seeded:', permissions.length);
}

seedPermissions()
    .then(() => console.log(' Permission seeding complete'))
    .catch((err) => console.error(' Permission seeding failed:', err))
    .finally(() => prisma.$disconnect());
