-- CreateTable
CREATE TABLE "monthly_payers" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "payersCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_payers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monthly_payers_householdId_idx" ON "monthly_payers"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_payers_householdId_year_month_key" ON "monthly_payers"("householdId", "year", "month");

-- AddForeignKey
ALTER TABLE "monthly_payers" ADD CONSTRAINT "monthly_payers_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
