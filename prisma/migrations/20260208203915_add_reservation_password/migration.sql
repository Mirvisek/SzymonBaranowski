/*
  Warnings:

  - Added the required column `password` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "answers" TEXT,
    "discountCodeId" TEXT,
    "totalPrice" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "OfferServices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("answers", "clientEmail", "clientName", "clientPhone", "code", "createdAt", "date", "discountCodeId", "id", "offerId", "status", "totalPrice") SELECT "answers", "clientEmail", "clientName", "clientPhone", "code", "createdAt", "date", "discountCodeId", "id", "offerId", "status", "totalPrice" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_code_key" ON "Reservation"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
