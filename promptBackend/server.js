require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authenticateJWT = require("./middleware/auth");
const Prompt = require("./models/Prompt");

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

app.post("/api/v1/prompt", authenticateJWT, async (req, res) => {
  // return res.status(500).json({
  //   statusCode: 500,
  //   message: "Server Error",
  // });
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      statusCode: 400,
      message: "Text is required",
      error: true,
      data: null,
    });
  }

  try {
    const prompt = new Prompt({
      user_id: req.user_id,
      text,
    });

    const savedPrompt = await prompt.save();

    res.status(201).json({
      statusCode: 201,
      message: "Prompt created successfully",
      error: null,
      data: {
        prompt_id: savedPrompt._id,
        user_id: req.user_id,
        text: savedPrompt.text,
        createdAt: savedPrompt.createdAt,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: true,
      data: null,
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
