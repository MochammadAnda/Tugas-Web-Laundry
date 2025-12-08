import { prisma } from '../../utils/prisma.js'

export const index = async ({ userId }) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            userPackages: {
                include: {
                    package: true,
                }
            }
        }
    });

    return user;
}

export const show = async ({userPackageId}) => {
    const userPackage = await prisma.userPackage.findUnique({
        where: {id: userPackageId},
        include: {
            user: true,
            package: true,
            logs: {
                include: {
                    order: true
                }
            }
        }
    });

    return userPackage;
}

export const store = async ({userId, packageId}) => {
    const mPackage = await prisma.mPackage.findUnique({
        where: {id: packageId}
    })
    const price = mPackage.price

    // Tambahkan ke data transaksi
    const newTransaction = await prisma.transaction.create({
        data: {
            user_id: userId,
            type: "PACKAGE",
            package_id: mPackage.id,
            total_price: price,
            status: "PENDING"
        }
    })

    return newTransaction;
}