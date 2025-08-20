import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const rolePermissions: Record<string, string[]> = {
    admin: [
        'role.role_list', 'role.role_create', 'role.role_edit', 'role.role_delete',
        'user.user_list', 'user.user_create', 'user.user_edit', 'user.user_delete',
        'country.country_list', 'country.country_create', 'country.country_edit', 'country.country_delete',
        'state.state_list', 'state.state_create', 'state.state_edit', 'state.state_delete',
        'district.district_list', 'district.district_create', 'district.district_edit', 'district.district_delete',
        'city.city_list', 'city.city_create', 'city.city_edit', 'city.city_delete',
        'category.category_list', 'category.category_create', 'category.category_edit', 'category.category_delete',
        'subCategory.subCategory_list', 'subCategory.subCategory_create', 'subCategory.subCategory_edit', 'subCategory.subCategory_delete',
        'product.product_list', 'product.product_create', 'product.product_edit', 'product.product_delete'
    ],
    vendor: [
        'product.product_list', 'product.product_create', 'product.product_edit', 'product.product_delete'
    ],
    customer: [
        'product.product_list'
    ]
};

async function rolePermissionSeeder() {
    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
        const role = await prisma.role.findUnique({
            where: { name: roleName }
        });

        if (!role) {
            console.warn(` Role '${roleName}' not found.`);
            continue;
        }

        for (const permFullName of permissionNames) {
            const permission = await prisma.permission.findUnique({
                where: { name: permFullName }
            });

            if (!permission) {
                console.warn(` Permission '${permFullName}' not found.`);
                continue;
            }

            await prisma.rolePermission.upsert({
                where: {
                    role_id_permission_id: {
                        role_id: role.id,
                        permission_id: permission.id
                    }
                },
                update: {},
                create: {
                    role_id: role.id,
                    permission_id: permission.id
                }
            });
        }

        console.log(` RolePermission seeded for role: ${roleName}`);
    }
}

rolePermissionSeeder()
    .then(() => console.log(' RolePermission seeding complete!'))
    .catch((err) => console.error(' Error seeding role permissions:', err))
    .finally(() => prisma.$disconnect());
