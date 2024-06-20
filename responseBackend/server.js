require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authenticateJWT = require("./middleware/auth");
const Response = require("./models/Response");

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

app.get("/api/v1/response", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Success Get Response",
  });
});

app.post("/api/v1/response", authenticateJWT, async (req, res) => {
  try {
    const { prompt_id, text, response } = req.body;

    if (!prompt_id || !text || !response) {
      return res.status(400).json({ message: "All fields are required", error: true, data: null });
    }

    const newResponse = new Response({
      user_id: req.userId,
      prompt_id,
      text,
      response,
    });

    const savedResponse = await newResponse.save();
    res.status(201).json({ message: "Response created successfully", error: false, data: savedResponse });
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ message: "Internal server error", error: true, data: null });
  }
});

app.get("/api/v1/allresponses", authenticateJWT, async (req, res) => {
  try {
    const userId = req.userId;

    const userResponses = await Response.find({ user_id: userId });

    res.status(200).json({ message: "Success Get User Responses", error: false, data: userResponses });
  } catch (error) {
    console.error("Error fetching user responses:", error);
    res.status(500).json({ message: "Internal server error", error: true, data: null });
  }
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
