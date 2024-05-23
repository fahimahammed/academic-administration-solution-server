import { PrismaClient } from '@prisma/client';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

const getDashboardData = async () => {
    const currentDate = new Date();
    const paymentHistory = [];
    const lecturesCount = [];

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
    }

    const studentCount = await prisma.student.count();
    const facultyCount = await prisma.faculty.count();
    const adminCount = await prisma.admin.count();
    const departmentCount = await prisma.academicDepartment.count();

    const totalFees = await prisma.studentSemesterPayment.aggregate({
        _sum: {
            totalPaidAmount: true,
        },
    });

    const completedCourses = await prisma.studentEnrolledCourse.groupBy({
        by: ['academicSemesterId'],
        _count: {
            id: true,
        },
        where: {
            status: 'COMPLETED',
        },
    });

    const totalCourses = await prisma.studentEnrolledCourse.groupBy({
        by: ['academicSemesterId'],
        _count: {
            id: true,
        },
    });

    const completionRates = totalCourses.map((total) => {
        const completed = completedCourses.find(
            (comp) => comp.academicSemesterId === total.academicSemesterId
        );
        return {
            semesterId: total.academicSemesterId,
            completionRate: completed
                ? (completed._count.id / total._count.id) * 100
                : 0,
        };
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysClassSchedules = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            createdAt: {
                gte: today,
                lt: tomorrow,
            },
        },
        include: {
            room: true,
            faculty: true,
            offeredCourseSection: {
                include: {
                    offeredCourse: {
                        include: {
                            course: true,
                        },
                    },
                },
            },
        },
    });

    return {
        metaData: {
            studentCount,
            facultyCount,
            adminCount,
            departmentCount,
            totalCourses,
            totalFees: totalFees._sum.totalPaidAmount,
        },
        paymentHistory: paymentHistory.reverse(), // To have the earliest month first
        courseCompletionRate: completionRates,
        averageLecturesPerMonth: lecturesCount.reverse(), // To have the earliest month first
        todaysClassSchedules,
    };
};


export const MetaServices = {
    getDashboardData
}