/*
  Warnings:

  - You are about to drop the column `pH` on the `sensorData` table. All the data in the column will be lost.
  - You are about to drop the column `tds` on the `sensorData` table. All the data in the column will be lost.
  - You are about to drop the column `turbidity` on the `sensorData` table. All the data in the column will be lost.
  - Added the required column `aq` to the `sensorData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `h2s` to the `sensorData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `sensorData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sensorData" DROP COLUMN "pH",
DROP COLUMN "tds",
DROP COLUMN "turbidity",
ADD COLUMN     "aq" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "h2s" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "humidity" DOUBLE PRECISION NOT NULL;
