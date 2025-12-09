import { prisma } from '../../utils/prisma.js'

// Mendapatkan data transaction dengan type package dengan status pending
export const index = async ({ status }) => {
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
            where: { id: packageTransaction.order_id },
            data: { status }
        })

        return updated;
    }

    const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
            status: "SUCCESS"
        }
    })
    const updatedOrder = await prisma.order.update({
        where: { id: updatedTransaction.order_id },
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

export const getAllOrder = async () => {
    const data = await prisma.order.findMany();
    return data;
}

export const getOrderLog = async (id) => {
    const data = await prisma.order.findUnique({
        where: { id },
        include: {
            orderLogs: true
        }
    })
    return data;
}

export const addOrderLog = async (id, log) => {
    const data = await prisma.order.findUnique({ where: { id } })
    if (!data) {
        throw new Error("data not found or already processed");
    }

    const createLog = await prisma.orderLog.create({
        data: {
            log: log,
            order_id: data.id
        }
    })
    return data;
}

export const setDone = async (id) => {
    const data = await prisma.order.findUnique({ where: { id } })
    if (!data) {
        throw new Error("data not found or already processed");
    }

    const updatedData = await prisma.order.update({
        where: {id},
        data: {
            status: "DONE"
        }
    })
    return updatedData;
}