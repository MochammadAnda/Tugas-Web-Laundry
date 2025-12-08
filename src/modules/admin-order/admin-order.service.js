import { prisma } from '../../utils/prisma.js'

// Mendapatkan data transaction dengan type package dengan status pending
export const index = async ({status}) => {
    const orderTransaction = await prisma.transaction.findMany({
        where: {
            type: "ORDER",
            status
        }
    })

    return orderTransaction;
}

export const setStatus = async ({ transactionId, status }) => {
    // Ambil transaction
    const packageTransaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            type: "ORDER",
            status: "PENDING"
        },
    });

    if (!packageTransaction) {
        throw new Error("Transaction not found or already processed");
    }

    // Jika bukan SUCCESS → update status saja
    if (status !== "SUCCESS") {
        const updated = await prisma.transaction.update({
            where: { id: transactionId },
            data: { status }
        });

        const updatedOrder = await prisma.order.update({
            where: {id: packageTransaction.order_id},
            data: {status}
        })

        return updated;
    }

    const updatedTransaction = await prisma.transaction.update({
        where: {id: transactionId},
        data: {
            status: "SUCCESS"
        }
    })
    const updatedOrder = await prisma.order.update({
        where: {id: updatedTransaction.order_id},
        data: {
            status: "SUCCESS",
            orderLogs: {
                create: {
                    log: "Order berhasil dibayar"
                }
            }
        }
    })
    return updatedOrder;
};
