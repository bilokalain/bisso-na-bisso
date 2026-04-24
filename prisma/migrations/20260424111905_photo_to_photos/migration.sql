-- Seed data will be rewritten with real photo arrays, so we drop the
-- single-photo column and add the new array column in one go.
ALTER TABLE "Annonce" DROP COLUMN "photo";
ALTER TABLE "Annonce" ADD COLUMN "photos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
