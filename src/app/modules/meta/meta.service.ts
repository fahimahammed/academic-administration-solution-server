import { PrismaClient, UserStatus } from '@prisma/client';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

const getDashboardData = async () => {
    const currentDate = new Date();
    const paymentHistory = [];
    const lecturesCount = [];
    const newStudentsCount = [];
    const newAdminsCount = [];
    const newFacultyCount = [];

    for (let i = 0; i < 12; i++) {
        const startDate = startOfMonth(subMonths(currentDate, i));
        const endDate = endOfMonth(subMonths(currentDate, i));

        const monthlyPayments = await prisma.studentSemesterPayment.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const totalMonthlyPayments = monthlyPayments.reduce(
            (sum, payment) => sum + (payment.totalPaidAmount || 0),
            0
        );

        paymentHistory.push({
            month: startDate.toLocaleString('default', { month: 'short' }),
            year: startDate.getFullYear(),
            totalPaidAmount: totalMonthlyPayments,
        });

        const monthlyLectures = await prisma.offeredCourseClassSchedule.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        lecturesCount.push({
            month: startDate.toLocaleString('default', { month: 'short' }),
            year: startDate.getFullYear(),
            lectureCount: monthlyLectures,
        });

        const newStudents = await prisma.student.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        newStudentsCount.push({
            month: startDate.toLocaleString('default', { month: 'short' }),
            year: startDate.getFullYear(),
            count: newStudents,
        });

        const newAdmins = await prisma.admin.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        newAdminsCount.push({
            month: startDate.toLocaleString('default', { month: 'short' }),
            year: startDate.getFullYear(),
            count: newAdmins,
        });

        const newFaculty = await prisma.faculty.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        newFacultyCount.push({
            month: startDate.toLocaleString('default', { month: 'short' }),
            year: startDate.getFullYear(),
            count: newFaculty,
        });
    }

    const studentCount = await prisma.student.count();
    const maleStudentCount = await prisma.student.count({
        where: {
            gender: 'MALE',
        },
    });
    const femaleStudentCount = await prisma.student.count({
        where: {
            gender: 'FEMALE',
        },
    });
    const facultyCount = await prisma.faculty.count();
    const adminCount = await prisma.admin.count();
    const departmentCount = await prisma.academicDepartment.count();
    const courseCount = await prisma.course.count();

    const totalFees = await prisma.studentSemesterPayment.aggregate({
        _sum: {
            totalPaidAmount: true,
        },
    });

    const totalDue = await prisma.studentSemesterPayment.aggregate({
        _sum: {
            totalDueAmount: true,
        },
    });

    const totalUserCount = await prisma.user.count();

    const activeUserCount = await prisma.user.count({
        where: {
            status: UserStatus.ACTIVE,
        },
    });

    return {
        metaData: {
            studentCount,
            maleStudentCount,
            femaleStudentCount,
            facultyCount,
            adminCount,
            departmentCount,
            courseCount,
            totalFees: totalFees._sum.totalPaidAmount,
            totalDue: totalDue._sum.totalDueAmount,
            totalUserCount,
            activeUserCount,
        },
        paymentHistory: paymentHistory.reverse(), // To have the earliest month first
        averageLecturesPerMonth: lecturesCount.reverse(), // To have the earliest month first
        newStudentsCount: newStudentsCount.reverse(),
        newAdminsCount: newAdminsCount.reverse(),
        newFacultyCount: newFacultyCount.reverse(),
    };
};

export const MetaServices = {
    getDashboardData
}
