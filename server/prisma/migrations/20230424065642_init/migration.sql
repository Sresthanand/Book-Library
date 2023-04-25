-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "BookId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);
