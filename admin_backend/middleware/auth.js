import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Authentication middleware to verify user token
 * 
 * This middleware validates the authorization header by making a request to the auth service.
 * If authentication is successful, the user object is attached to the request object.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.authorization] - Authorization header containing the token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if authenticated, otherwise returns 401 response
 */
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