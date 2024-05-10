/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `student_semester_payment_histories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_semester_payment_histories_transactionId_key" ON "student_semester_payment_histories"("transactionId");
