-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "ville" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Annonce" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
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
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Annonce_type_idx" ON "Annonce"("type");

-- CreateIndex
CREATE INDEX "Annonce_ville_idx" ON "Annonce"("ville");

-- CreateIndex
CREATE INDEX "Annonce_categorie_idx" ON "Annonce"("categorie");
