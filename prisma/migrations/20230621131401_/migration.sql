/*
  Warnings:

  - You are about to drop the column `paymentMethods` on the `student_semester_payment_histories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_semester_payment_histories" DROP COLUMN "paymentMethods",
ADD COLUMN     "paymentMethod" "PaymentMethod" DEFAULT 'ONLINE';
