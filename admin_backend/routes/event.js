import express from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService.js";
import { isAuthenticated } from "../middleware/auth.js";
import { getConnection } from "../database/connection.js";

/**
 * Express router for event API endpoints
 * @module routes/event
 */
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         price:
 *           type: number
 *           format: float
 *         type:
 *           type: string
 *     Event:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         image:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         tickets_available:
 *           type: boolean
 *         tickets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ticket'
 */

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Get all events with their descriptions
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
/**
 * Get all events with their descriptions
 * @name GET /api/admin/events
 * @function
 * @memberof module:routes/event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of events
 */
router.get("/api/admin/events", isAuthenticated, async (req, res) => {
  try {
    const events = await getEvents();
    res.send({ data: events });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch events" });
  }
});

/**
 * @swagger
 * /api/admin/events/{id}:
 *   get:
 *     summary: Get a specific event by ID with its description and tickets
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
/**
 * Get a specific event by ID with its description and tickets
 * @name GET /api/admin/events/:id
 * @function
 * @memberof module:routes/event
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request path parameters
 * @param {string} req.params.id - Event ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with event details or error
 */
router.get("/api/admin/events/:id", isAuthenticated, async (req, res) => {
  try {
    const eventId = req.params.id;
    const connection = await getConnection();
    const event = await getEvent(connection, eventId);

    if (!event) {
      return res.status(404).send({ error: "Event not found" });
    }
    res.send({ data: event });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch event" });
  }
});

/**
 * @swagger
 * /api/admin/events:
 *   post:
 *     summary: Create a new event with description and tickets
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               tickets:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
/**
 * Create a new event with description and tickets
 * @name POST /api/admin/events
 * @function
 * @memberof module:routes/event
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing event data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created event or error
 */
router.post("/api/admin/events", isAuthenticated, async (req, res) => {
  try {
    const event = req.body;
    const newEvent = await createEvent(event);
    res.send({ data: newEvent });
  } catch (error) {
    res.status(500).send({ error: "Failed to create event" });
  }
});

/**
 * @swagger
 * /api/admin/events/{id}:
 *   patch:
 *     summary: Update an existing event, its description and tickets
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               tickets_available:
 *                 type: boolean
 *               tickets:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
/**
 * Update an existing event, its description and tickets
 * @name PATCH /api/admin/events/:id
 * @function
 * @memberof module:routes/event
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request path parameters
 * @param {string} req.params.id - Event ID
 * @param {Object} req.body - Request body containing event data to update
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated event or error
 */
router.patch("/api/admin/events/:id", isAuthenticated, async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    const updatedEvent = await updateEvent(eventId, eventData);

    if (!updatedEvent) {
      return res.status(404).send({ error: "Event not found" });
    }
    res.send({ data: updatedEvent });
  } catch (error) {
    res.status(500).send({ error: "Failed to update event" });
  }
});

/**
 * @swagger
 * /api/admin/events/{id}:
 *   delete:
 *     summary: Delete an event, its description and associated tickets
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
/**
 * Delete an event, its description and associated tickets
 * @name DELETE /api/admin/events/:id
 * @function
 * @memberof module:routes/event
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request path parameters
 * @param {string} req.params.id - Event ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
router.delete("/api/admin/events/:id", isAuthenticated, async (req, res) => {
  try {
    const eventId = req.params.id;
    await deleteEvent(eventId);
    res.send({ message: "Event deleted successfully" });
  } catch (error) {
    if (error.message === "Event not found") {
      return res.status(404).send({ error: "Event not found" });
    }
    res.status(500).send({ error: "Failed to delete event" });
  }
});

export default router;
