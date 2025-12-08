import { prisma } from '../../../utils/prisma.js'

export const index = async () => {
    const expenses = await prisma.mExpense.findMany();
    return expenses;
}

export const show = async ({ id }) => {
    const expense = await prisma.mExpense.findUnique({ where: { id } })
    if (!expense) throw new Error("Expense not found"); // Mengubah pesan error agar lebih sesuai

    return expense;
}

export const store = async ({name, category, amount, due_date, status}) => {
    const expense = await prisma.mExpense.create({
        data: {name, category, amount, due_date, status}
    });

    return expense;
}

export const update = async ({ id, name, category, amount, due_date, status }) => {
    const existingExpense = await prisma.mExpense.findUnique({ where: { id } });
    if (!existingExpense) throw new Error("Expense not found");

    const expense = await prisma.mExpense.update({
        where: { id },
        data: { name, category, amount, due_date, status }
    });

    return expense;
}

export const destroy = async ({ id }) => {
    const existingExpense = await prisma.mExpense.findUnique({ where: { id } });
    if (!existingExpense) throw new Error("Expense not found");

    const expense = await prisma.mExpense.delete({
        where: { id }
    });

    return expense;
}

export const setDone = async ({ id }) => {
    const existingExpense = await prisma.mExpense.findUnique({ where: { id } });
    if (!existingExpense) throw new Error("Expense not found");

    const expense = await prisma.mExpense.update({
        where: { id },
        data: {status: "DONE"}
    });

    return expense;
}