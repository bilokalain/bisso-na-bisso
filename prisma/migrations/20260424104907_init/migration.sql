-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ARCHIVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('ENABLED', 'COMING_SOON', 'DISABLED');

-- CreateEnum
CREATE TYPE "GuideStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "ville" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annonce" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ville" TEXT,
    "photo" TEXT,
    "prix" DOUBLE PRECISION,
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "categorie" TEXT,
    "villeDepart" TEXT,
    "villeArrivee" TEXT,
    "dateVoyage" TIMESTAMP(3),
    "kgDispo" DOUBLE PRECISION,
    "prixParKg" DOUBLE PRECISION,
    "matiere" TEXT,
    "niveau" TEXT,
    "modalite" TEXT,
    "contactNom" TEXT NOT NULL,
    "contactTelephone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Annonce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "status" "ModuleStatus" NOT NULL DEFAULT 'DISABLED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleInterest" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tldr" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "heroImage" TEXT,
    "readingMinutes" INTEGER NOT NULL DEFAULT 5,
    "authorName" TEXT,
    "status" "GuideStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Annonce_slug_key" ON "Annonce"("slug");

-- CreateIndex
CREATE INDEX "Annonce_type_idx" ON "Annonce"("type");

-- CreateIndex
CREATE INDEX "Annonce_ville_idx" ON "Annonce"("ville");

-- CreateIndex
CREATE INDEX "Annonce_categorie_idx" ON "Annonce"("categorie");

-- CreateIndex
CREATE INDEX "Annonce_status_idx" ON "Annonce"("status");

-- CreateIndex
CREATE INDEX "Annonce_expiresAt_idx" ON "Annonce"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Module_key_key" ON "Module"("key");

-- CreateIndex
CREATE INDEX "Module_status_idx" ON "Module"("status");

-- CreateIndex
CREATE INDEX "Module_order_idx" ON "Module"("order");

-- CreateIndex
CREATE INDEX "ModuleInterest_moduleId_idx" ON "ModuleInterest"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleInterest_moduleId_email_key" ON "ModuleInterest"("moduleId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_status_idx" ON "Guide"("status");

-- CreateIndex
CREATE INDEX "Guide_category_idx" ON "Guide"("category");

-- CreateIndex
CREATE INDEX "Guide_publishedAt_idx" ON "Guide"("publishedAt");

-- AddForeignKey
ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleInterest" ADD CONSTRAINT "ModuleInterest_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
