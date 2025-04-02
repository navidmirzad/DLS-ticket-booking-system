import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/api/authService", (req, res) => {
  res.send({ data: "Hello from AuthService" });
});

const PORT = process.env.AUTHSERVICE_BACKEND_PORT;
app.listen(PORT, () => {
  console.log("AuthService is running on PORT: ", PORT);
});
