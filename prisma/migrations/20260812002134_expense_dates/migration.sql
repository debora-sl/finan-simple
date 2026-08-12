-- DropIndex
DROP INDEX "expense_householdId_date_idx";

-- RenameColumn
ALTER TABLE "expense" RENAME COLUMN "date" TO "dueDate";

-- AlterColumn (preserve the intended calendar day, drop timestamp precision and NOT NULL)
ALTER TABLE "expense" ALTER COLUMN "dueDate" TYPE DATE USING "dueDate"::date;
ALTER TABLE "expense" ALTER COLUMN "dueDate" DROP NOT NULL;

-- AddColumn
ALTER TABLE "expense" ADD COLUMN "paidDate" DATE;

-- DropColumn
ALTER TABLE "expense" DROP COLUMN "isPaid";

-- CreateIndex
CREATE INDEX "expense_householdId_dueDate_idx" ON "expense"("householdId", "dueDate");
