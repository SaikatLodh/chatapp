const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

function setupMiddleware(app) {
  // Enable cookie parser middleware
  app.use(cookieParser());

  // Enable CORS with credentials support
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000", // frontend URL
      credentials: true,
    })
  );

  // Other middlewares can be added here
}

module.exports = setupMiddleware;
