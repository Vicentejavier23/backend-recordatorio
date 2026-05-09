/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Suscripcion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Suscripcion_userId_key" ON "Suscripcion"("userId");
