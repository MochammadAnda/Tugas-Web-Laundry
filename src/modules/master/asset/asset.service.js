import { prisma } from '../../../utils/prisma.js'

export const index = async () => {
    const assets = await prisma.mAsset.findMany();
    return assets;
}

export const show = async ({ id }) => {
    const asset = await prisma.mAsset.findUnique({ where: { id } })
    if (!asset) throw new Error("Asset not found");

    return asset;
}

export const store = async ({ name, buy_price, nilai_sisa, umur_ekonomis, buy_date }) => {
    const asset = await prisma.mAsset.create({
        data: { name, buy_price, nilai_sisa, umur_ekonomis, buy_date }
    });

    return asset;
}

export const update = async ({ id, name, buy_price, nilai_sisa, umur_ekonomis, buy_date }) => {
    const existingAsset = await prisma.mAsset.findUnique({ where: { id } });
    if (!existingAsset) throw new Error("Asset not found");

    const asset = await prisma.mAsset.update({
        where: { id },
        data: { name, buy_price, nilai_sisa, umur_ekonomis, buy_date }
    });

    return asset;
}

export const destroy = async ({ id }) => {
    const existingAsset = await prisma.mAsset.findUnique({ where: { id } });
    if (!existingAsset) throw new Error("Asset not found");

    const asset = await prisma.mAsset.delete({
        where: { id }
    });

    return asset;
}