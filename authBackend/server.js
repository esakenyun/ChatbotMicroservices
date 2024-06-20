require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Koneksi database terputus");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Terlalu banyak koneksi database");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Koneksi database ditolak");
    }
  }
  if (connection) {
    console.log("Berhasil terhubung ke database MySQL");
    connection.release();
  }
  return;
});

// Register Endpoint
app.post("/api/v1/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email and password are required",
      error: true,
      data: null,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = "INSERT INTO users (email, password) VALUES (?, ?)";
  pool.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          statusCode: 400,
          message: "Email is already in use",
          error: true,
          data: null,
        });
      }

      return res.status(500).json({
        statusCode: 500,
        message: "Server error",
        error: true,
        data: {
          error: err.message,
        },
      });
    }

    const userId = results.insertId;

    res.status(201).json({
      statusCode: 201,
      message: "Success register",
      error: null,
      data: {
        email: email,
        id: userId,
      },
    });
  });
});

// Login Endpoint
app.post("/api/v1/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email and password are required",
      error: true,
      data: null,
    });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  pool.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        statusCode: 500,
        message: "Server error",
        error: true,
        data: {
          error: err.message,
        },
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        error: true,
        data: null,
      });
    }

    const user = results[0];

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid password",
        error: true,
        data: null,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
      expiresIn: 86400,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Login successful",
      error: null,
      data: {
        id: user.id,
        email: user.email,
        token: token,
      },
    });
  });
});

// Protected Route Example
app.get("/prompt", (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("No token provided");
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    const query = "SELECT email FROM users WHERE id = ?";
    pool.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).send("No user found");
      }

      res.status(200).send(results[0]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
