const express = require('express');
const database = require('../db.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = database.db;
const createUser = async (req, res) => {
  let userName = req.body.userName;
  let email = req.body.email;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  await db.getConnection(async (err, connection) => {
    if (err)
      throw err;
    const existing_user = "SELECT * FROM users WHERE userName=? AND EmailId=?";
    const existing_user_query = mysql.format(existing_user, [userName, email]);
    await connection.query(existing_user_query, async (err, result) => {
      if (err)
        throw err;
      if (result.length !== 0) {
        console.log("User already exists!");
        connection.release();
        return res.status(400).json({ message: "User already exists!" });
      } else {
        const createId = "INSERT INTO users (userName, EmailId, password) VALUES (?, ?, ?)";
        const createId_query = mysql.format(createId, [userName, email, hashedPassword]);
        connection.query(createId_query, (err, result) => {
          if (err)
            throw err;
          console.log("User created successfully");
          connection.release();
          res.status(201).json({ message: "User created successfully", result });
        });
      }
    });
  });
};

const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  await db.getConnection(async (err, connection) => {
    if (err)
      throw err;
    const user_search = "SELECT * FROM users WHERE EmailId = ?";
    const user_search_query = mysql.format(user_search, [email]);
    connection.query(user_search_query, async (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        connection.release();
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result.length === 0) {
        console.log("Email ID doesn't exist! Kindly register.");
        connection.release();
        return res.status(404).json({ error: "Email ID not found" });
      }
      const hashedPassword = result[0].Password; // Now it's safe to access
      await bcrypt.compare(password, hashedPassword, async (err, passwordMatch) => {
        if (err) {
          console.error("Error in password comparison:", err);
          connection.release();
          return res.status(500).json({ error: "Internal server error" });
        }
        if (passwordMatch) {
          console.log("Logged in successfully");
          connection.release();
          return res.json({ message: "Login successful", result });
        } else {
          console.log("Email and password didn't match");
          connection.release();
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    });
  })
};
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
