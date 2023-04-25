import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import uploadFile from "./aws";
import upload from "./middleware/multer";

const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;

app.post("/books", async (req, res) => {
  try {
    const { name, author, readTime, details, image, pdf } = req.body;
    const book = await prisma.book.create({
      data: {
        name,
        author,
        readTime,
        details,
        image,
        pdf,
      },
    });
    res.json({ message: "Book details saved successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getbooks", async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/aboutbook/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/rating", async (req, res) => {
  try {
    const { BookId, rating } = req.body;

    const bookIdInt = parseInt(BookId);

    console.log(bookIdInt);
    console.log(rating);

    const newRating = await prisma.rating.create({
      data: {
        BookId: bookIdInt,
        rating: rating,
      },
    });

    res.status(200).json({ message: "Rating submitted successfully!" });
  } catch (error) {
    console.error("Failed to submit rating:", error);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

app.get("/rating/:BookId", async (req, res) => {
  try {
    const { BookId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { BookId: parseInt(BookId) },
    });

    if (ratings.length > 0) {
      res.status(200).json({ ratings });
    } else {
      res.status(404).json({ error: "Ratings not found" });
    }
  } catch (error) {
    console.error("Failed to get ratings:", error);
    res.status(500).json({ error: "Failed to get ratings" });
  }
});

app.post(
  "/uploadImage",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  (req, res) => {
    const file = req.files;
    console.log("hello i am from upload image api!");
    console.log(file);

    if (!file) {
      res.status(400).json({ error: "No files were Found!!" });
    } else {
      uploadFile(file).then(function (result) {
        console.log(result);
        res.send(result);
      });
    }
  }
);

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
