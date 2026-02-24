-- CreateTable
CREATE TABLE "cv_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysis_result" JSONB,
    "rewrite_result" JSONB,
    "analyzed_at" TIMESTAMP(3),
    "rewritten_at" TIMESTAMP(3),

    CONSTRAINT "cv_uploads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cv_uploads" ADD CONSTRAINT "cv_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
