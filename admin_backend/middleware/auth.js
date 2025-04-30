import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ 
      message: "No authorization header found",
      authUrl: process.env.AUTH_URL
    });
  }

  try {
    const response = await axios.get(`${process.env.AUTH_URL}/api/auth/me`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    
    req.user = response.data;
    next();
  } catch (error) {
    return res.status(401).send({ 
      message: "Authentication failed", 
      error: error.response.data
    });
  }
}