/*
  Warnings:

  - Added the required column `expiresAt` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Annonce" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ville" TEXT,
    "photo" TEXT,
    "prix" REAL,
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "categorie" TEXT,
    "villeDepart" TEXT,
    "villeArrivee" TEXT,
    "dateVoyage" DATETIME,
    "kgDispo" REAL,
    "prixParKg" REAL,
    "matiere" TEXT,
    "niveau" TEXT,
    "modalite" TEXT,
    "contactNom" TEXT NOT NULL,
    "contactTelephone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" DATETIME NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Annonce" ("categorie", "contactEmail", "contactNom", "contactTelephone", "createdAt", "dateVoyage", "description", "devise", "id", "kgDispo", "matiere", "modalite", "niveau", "photo", "prix", "prixParKg", "titre", "type", "userId", "ville", "villeArrivee", "villeDepart") SELECT "categorie", "contactEmail", "contactNom", "contactTelephone", "createdAt", "dateVoyage", "description", "devise", "id", "kgDispo", "matiere", "modalite", "niveau", "photo", "prix", "prixParKg", "titre", "type", "userId", "ville", "villeArrivee", "villeDepart" FROM "Annonce";
DROP TABLE "Annonce";
ALTER TABLE "new_Annonce" RENAME TO "Annonce";
CREATE INDEX "Annonce_type_idx" ON "Annonce"("type");
CREATE INDEX "Annonce_ville_idx" ON "Annonce"("ville");
CREATE INDEX "Annonce_categorie_idx" ON "Annonce"("categorie");
CREATE INDEX "Annonce_status_idx" ON "Annonce"("status");
CREATE INDEX "Annonce_expiresAt_idx" ON "Annonce"("expiresAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "ville" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "nom", "telephone", "ville") SELECT "createdAt", "email", "id", "nom", "telephone", "ville" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
