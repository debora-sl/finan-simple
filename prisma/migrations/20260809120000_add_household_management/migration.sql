PRAGMA foreign_keys=OFF;

-- CreateTable
CREATE TABLE "household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "membership_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invitation_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- DataMigration: default household + admin membership per existing user
INSERT INTO "household" ("id", "name", "createdAt", "updatedAt")
SELECT 'household_' || "id", 'Minha Casa', "createdAt", "createdAt" FROM "user";

INSERT INTO "membership" ("id", "userId", "householdId", "role", "joinedAt")
SELECT 'membership_' || "id", "id", 'household_' || "id", 'ADMIN', "createdAt" FROM "user";

-- AlterTable: add activeHouseholdId to user
ALTER TABLE "user" ADD COLUMN "activeHouseholdId" TEXT REFERENCES "household" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DataMigration: point every user at their default household
UPDATE "user" SET "activeHouseholdId" = 'household_' || "id";

-- RedefineTable: category (userId -> householdId)
CREATE TABLE "new_category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameLower" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "category_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_category" ("id", "name", "nameLower", "householdId", "createdAt", "updatedAt")
SELECT "id", "name", "nameLower", 'household_' || "userId", "createdAt", "updatedAt" FROM "category";
DROP TABLE "category";
ALTER TABLE "new_category" RENAME TO "category";
CREATE UNIQUE INDEX "category_householdId_nameLower_key" ON "category"("householdId", "nameLower");

-- RedefineTable: expense (userId -> householdId)
CREATE TABLE "new_expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "householdId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "expense_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_expense" ("id", "description", "amountInCents", "date", "isPaid", "categoryId", "householdId", "createdAt", "updatedAt")
SELECT "id", "description", "amountInCents", "date", "isPaid", "categoryId", 'household_' || "userId", "createdAt", "updatedAt" FROM "expense";
DROP TABLE "expense";
ALTER TABLE "new_expense" RENAME TO "expense";
CREATE INDEX "expense_householdId_date_idx" ON "expense"("householdId", "date");
CREATE INDEX "expense_householdId_categoryId_idx" ON "expense"("householdId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "membership_userId_householdId_key" ON "membership"("userId", "householdId");
CREATE INDEX "membership_householdId_idx" ON "membership"("householdId");
CREATE INDEX "membership_householdId_role_idx" ON "membership"("householdId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_householdId_email_key" ON "invitation"("householdId", "email");
CREATE INDEX "invitation_email_status_idx" ON "invitation"("email", "status");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
