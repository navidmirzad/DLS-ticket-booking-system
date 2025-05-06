import express from 'express';

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
router.get("/api/admin", (req, res) => {
    res.send({ data: "Hello from admin backend" });
  });
  

export default router;