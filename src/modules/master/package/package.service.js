import { prisma } from '../../../utils/prisma.js'

export const index = async () => {
    const pkg = await prisma.mPackage.findMany();
    return pkg;
}

export const show = async ({ id }) => {
    const pkg = await prisma.mPackage.findUnique({ where: { id } })
    if (!pkg) throw new Error("Package not found");

    return pkg;
}

export const store = async ({ name, description, price, quota }) => {
    const pkg = await prisma.mPackage.create({
        data: { name, description, price, quota }
    });

    return pkg;
}

export const update = async ({ id, name, description, price, quota }) => {
    const existingPkg = await prisma.mPackage.findUnique({ where: { id } });
    if (!existingPkg) throw new Error("Package not found");

    const pkg = await prisma.mPackage.update({
        where: { id },
        data: { name, description, price, quota }
    });

    return pkg;
}

export const destroy = async ({ id }) => {
    const existingPkg = await prisma.mPackage.findUnique({ where: { id } });
    if (!existingPkg) throw new Error("Package not found");

    const pkg = await prisma.mPackage.delete({
        where: { id }
    });

    return pkg;
}