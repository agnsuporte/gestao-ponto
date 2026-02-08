-- CreateTable
CREATE TABLE "TimeRecord" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "turno1_entrada" TEXT,
    "turno1_saida" TEXT,
    "almoco_entrada" TEXT,
    "almoco_saida" TEXT,
    "turno2_entrada" TEXT,
    "turno2_saida" TEXT,
    "total_minutes" INTEGER,
    "overtime_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "TimeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeRecord_date_idx" ON "TimeRecord"("date");

-- CreateIndex
CREATE INDEX "TimeRecord_user_id_idx" ON "TimeRecord"("user_id");
