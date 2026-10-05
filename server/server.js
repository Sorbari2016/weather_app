import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Configure dotenv
dotenv.config();

// Create an express app
const app = express();

// Use middlewares
app.use(express.json()); // // parse incoming request data
app.use(cors); // allow front-end to make request to the server

// Define port
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
