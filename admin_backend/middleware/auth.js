import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
  console.log("Token received in header:", req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    console.log("Calling auth service at:", process.env.AUTH_URL);
    const response = await axios.get(process.env.AUTH_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Auth response:", response.data);
    req.user = response.data.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

export { authenticate, authorizeAdmin };
