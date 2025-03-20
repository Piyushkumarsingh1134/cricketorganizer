/*
  Warnings:

  - A unique constraint covering the columns `[captainEmail]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_captainEmail_key" ON "Team"("captainEmail");
