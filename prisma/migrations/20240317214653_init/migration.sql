-- CreateTable
CREATE TABLE "Jet" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "wingspan" DOUBLE PRECISION NOT NULL,
    "engines" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Jet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jet_name_key" ON "Jet"("name");
