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
};

export const generateAdminId = async () => {
    const currentCode = (await findLastAdminId()) || (0).toString().padStart(5, '0');
    let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
    newCode = `A-${newCode}`;
    return newCode;
};

//find student id
export const findLastStudentId = async () => {
    const lastStudent = await prisma.student.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            studentId: true
        }
    });
    return lastStudent?.studentId ? lastStudent?.studentId.substring(4) : null;
};

// Generate student id
export const generateStudentId = async (academicSemester: any) => {
    const currentCode = (await findLastStudentId()) || (0).toString().padStart(5, '0');
    let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
    newCode = `${academicSemester.year.toString().substring(2)}${academicSemester?.code}${newCode}`;
    return newCode;
};

