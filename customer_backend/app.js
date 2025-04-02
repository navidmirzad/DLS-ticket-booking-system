import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/api/customer", (req, res) => {
  res.send({ data: "Hello from customer backend" });
});

const PORT = process.env.CUSTOMER_BACKEND_PORT;
app.listen(PORT, () => {
  console.log("Customer backend is running on PORT: ", PORT);
});
