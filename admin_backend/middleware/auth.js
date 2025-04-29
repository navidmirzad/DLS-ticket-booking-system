import axios from "axios";

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const response = await axios.get(process.env.AUTH_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
