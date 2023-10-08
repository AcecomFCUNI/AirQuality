/*
  Warnings:

  - You are about to drop the column `h2s` on the `sensorData` table. All the data in the column will be lost.
  - Added the required column `co2` to the `sensorData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pm2_5` to the `sensorData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pressure` to the `sensorData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sensorData" DROP COLUMN "h2s",
ADD COLUMN     "co2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pm2_5" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pressure" DOUBLE PRECISION NOT NULL;
