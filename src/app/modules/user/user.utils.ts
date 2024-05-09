import prisma from "../../../shared/prisma";

// Generate admin id
export const findLastAdminId = async () => {
    const lastAdmin = await prisma.admin.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            userId: true
        }
    });
    return lastAdmin?.userId ? lastAdmin?.userId.substring(2) : null;
}

export const generateAdminId = async () => {
    const currentCode = (await findLastAdminId()) || (0).toString().padStart(5, '0');
    let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
    newCode = `A-${newCode}`;
    return newCode;
};
