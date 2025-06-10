import amqp from "amqplib";

/**
 * RabbitMQ connection object
 * @type {amqp.Connection|null}
 */
let connection = null;

/**
 * RabbitMQ channel for message publishing
 * @type {amqp.Channel|null}
 */
let channel = null;

/**
 * Indicates if a reconnection attempt is in progress
 * @type {boolean}
 */
let isConnecting = false;

/**
 * Connects to RabbitMQ server with retry and auto-reconnect logic.
 * Sets up all required queues and handles connection loss.
 * @async
 * @param {number} [retries=5] - Number of connection retry attempts
 * @param {number} [delay=5000] - Delay between retries in milliseconds
 * @throws {Error} If connection fails after all retries
 * @returns {Promise<void>}
 */
const setupRabbit = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("eventCreated");
      await channel.assertQueue("eventUpdated");
      await channel.assertQueue("eventDeleted");
      console.log("RabbitMQ connected ✅");

      // Handle connection close/errors for auto-reconnect
      connection.on("close", async () => {
        console.error("RabbitMQ connection closed. Reconnecting...");
        channel = null;
        connection = null;
        if (!isConnecting) {
          isConnecting = true;
          await setupRabbit();
          isConnecting = false;
        }
      });
      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
      });

      return;
    } catch (error) {
      console.error("RabbitMQ connection failed. Retrying...", error);
      retries -= 1;
      if (retries === 0)
        throw new Error("RabbitMQ connection failed after retries");
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Initializes the RabbitMQ connection and channel.
 * @async
 * @param {number} [retries=5] - Number of connection retry attempts
 * @param {number} [delay=5000] - Delay between retries in milliseconds
 * @returns {Promise<void>}
 */
export const connectRabbit = async (retries = 5, delay = 5000) => {
  await setupRabbit(retries, delay);
};

/**
 * Publishes an event to the RabbitMQ queue with auto-reconnect on failure.
 * @async
 * @param {Object} event - Event object to publish
 * @param {string} event.type - Type of event (e.g., "EventCreated", "EventUpdated")
 * @param {Object} event.payload - Event data payload
 * @throws {Error} If RabbitMQ channel is not initialized
 * @returns {Promise<void>}
 */
export const publishEvent = async (event) => {
  console.log(event);
  if (!channel) {
    console.warn("RabbitMQ channel not initialized, reconnecting...");
    await connectRabbit();
  }
  try {
    // Send all event types to the same queue for the customer backend
    channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(event)));
  } catch (err) {
    // If channel is closed, try to reconnect and retry once
    console.error("Publish failed, attempting reconnect...", err);
    channel = null;
    await connectRabbit();
    // Retry once
    channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(event)));
  }
};
