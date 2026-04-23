WITH ranked_records AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "userId", "date"
            ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC
        ) AS row_number
    FROM "TimeRecord"
)
DELETE FROM "TimeRecord"
WHERE "id" IN (
    SELECT "id"
    FROM ranked_records
    WHERE row_number > 1
);

CREATE UNIQUE INDEX "TimeRecord_userId_date_key" ON "TimeRecord"("userId", "date");
