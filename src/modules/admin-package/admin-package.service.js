import { prisma } from '../../utils/prisma.js'

// Mendapatkan data transaction dengan type package dengan status pending
export const index = async () => {
    const packageTransactions = await prisma.transaction.findMany({
        where: {
            type: "PACKAGE",
            status: "PENDING"
        }
    })

    return packageTransactions;
}

export const setStatus = async ({ transactionId, status }) => {
    // Ambil transaction
    const packageTransaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            type: "PACKAGE",
            status: "PENDING"
        },
        include: {
            package: true
        }
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

        return updated;
    }

    // Jika SUCCESS → buat userPackage + log + update transaksi
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    const result = await prisma.$transaction(async (tx) => {
        // 1. Update status transaksi
        await tx.transaction.update({
            where: { id: transactionId },
            data: { status: "SUCCESS" }
        });

        // 2. Buat user package + log nested
        const newUserPackage = await tx.userPackage.create({
            data: {
                user_id: packageTransaction.user_id,
                package_id: packageTransaction.package_id,
                quota: packageTransaction.package.quota,
                expired_at: expiredAt,
                logs: {
                    create: {
                        type: "INITIAL",
                        quota: packageTransaction.package.quota,
                        order_id: null
                    }
                }
            },
            include: {
                logs: true
            }
        });

        return newUserPackage;
    });

    return result;
};
