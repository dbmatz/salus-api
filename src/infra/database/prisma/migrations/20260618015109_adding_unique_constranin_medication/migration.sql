/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name,dosage]` on the table `medications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medications_user_id_name_dosage_key" ON "medications"("user_id", "name", "dosage");
