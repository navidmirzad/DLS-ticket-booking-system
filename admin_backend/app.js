import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/api/admin", (req, res) => {
  res.send({ data: "Hello from admin backend" });
});

const PORT = process.env.ADMIN_BACKEND_PORT;
app.listen(PORT, () => {
  console.log("Admin backend is running on PORT: ", PORT);
});
