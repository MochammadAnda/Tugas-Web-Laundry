import { prisma } from '../../utils/prisma.js'

export const index = async ({ userId }) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    service: true,
                    user_package: true
                }
            }
        }
    });

    return user;
}

export const show = async ({ orderId }) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            service: true,
            user_package: true,
            orderLogs: true
        }
    });

    return order;
}

export const store = async ({ user_id, service_id, quantity_kg, delivery_method, address, user_package_id = null }) => {
    const mService = await prisma.mService.findUnique({
        where: { id: service_id }
    })
    const total_price = mService.price_per_unit * quantity_kg;

    // Tambah data order baru
    const newOrder = await prisma.order.create({
        data: {
            user_id, service_id, quantity_kg, delivery_method, address, user_package_id, status: "PENDING"
        }
    })
    const newTransaction = await prisma.transaction.create({
        data: {
            user_id, type: "ORDER", order_id: newOrder.id, total_price, status: "PENDING"
        }
    })

    // Kondisi ketika membayar pakai quota user_package_id
    if (user_package_id) {
        const latestUserPackageLogs = await prisma.userPackageLog.findFirst({
            where: {
                user_package_id
            },
            orderBy: {
                created_at: "desc"
            }
        })
        const quotaLeft = latestUserPackageLogs.quota - quantity_kg;
        const updatedOrder = await prisma.order.update({
            where: { id: newOrder.id },
            data: {
                status: "SUCCESS",
                orderLogs: {
                    create: {
                        log: "Order berhasil dibayar."
                    }
                },
                userPackageLogs: {
                    create: {
                        user_package_id,
                        type: "TRANSACTION",
                        quota: quotaLeft,
                    }
                }
            }
        })
        await prisma.userPackage.update({
            where: { id: user_package_id },
            data: {
                quota: quotaLeft
            }
        });
        const updatedTransaction = await prisma.transaction.update({
            where: { id: newTransaction.id },
            data: { status: "SUCCESS", total_price: 0 }
        })
        return updatedTransaction;
    }
    return newTransaction;
}