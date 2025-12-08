import { prisma } from '../../../utils/prisma.js'

export const index = async () => {
    const service = await prisma.mService.findMany();
    return service;
}

export const show = async ({ id }) => {
    const service = await prisma.mService.findUnique({ where: { id } })
    if (!service) throw new Error("Service not found");

    return service;
}

export const store = async ({ name, description, price_per_unit, unit, status }) => {
    const service = await prisma.mService.create({
        data: { name, description, price_per_unit, unit, status }
    });

    return service;
}

export const update = async ({ id, name, description, price_per_unit, unit, status }) => {
    const existingService = await prisma.mService.findUnique({ where: { id } });
    if (!existingService) throw new Error("Service not found");

    const service = await prisma.mService.update({
        where: { id },
        data: { name, description, price_per_unit, unit, status }
    });

    return service;
}

export const destroy = async ({ id }) => {
    const existingService = await prisma.mService.findUnique({ where: { id } });
    if (!existingService) throw new Error("Service not found");

    const expense = await prisma.mService.delete({
        where: { id }
    });

    return expense;
}

export const setStatus = async ({id}) => {
    const existingService = await prisma.mService.findUnique({ where: { id } });
    if (!existingService) throw new Error("Service not found");

    const status = existingService.status == "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const expense = await prisma.mService.update({
        where: {id},
        data: {status}
    });

    return expense;
}