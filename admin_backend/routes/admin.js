import express from 'express';

/**
 * Express router for admin API endpoints
 * @module routes/admin
 */
const router = express.Router();

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Test endpoint
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Returns a hello message
 */
/**
 * Test endpoint that returns a hello message
 * @name GET /api/admin
 * @function
 * @memberof module:routes/admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with hello message
 */
router.get("/api/admin", (req, res) => {
    res.send({ data: "Hello from admin backend" });
  });
  

export default router;