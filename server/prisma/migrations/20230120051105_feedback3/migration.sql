/*
  Warnings:

  - You are about to drop the column `reportedId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportedId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reportedId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
