import amqp from "amqplib";

/**
 * RabbitMQ channel for message publishing
 * @type {Object|null}
 */
let channel;

/**
 * Connects to RabbitMQ server with retry mechanism
 * @async
 * @param {number} [retries=5] - Number of connection retry attempts
 * @param {number} [delay=5000] - Delay between retries in milliseconds
 * @throws {Error} If connection fails after all retries
 * @returns {Promise<void>}
 */
export const connectRabbit = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("eventQueue"); // Ensure the queue exists
      console.log("RabbitMQ connected ✅");
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
 * Publishes an event to the RabbitMQ queue
 * @async
 * @param {Object} event - Event object to publish
 * @param {string} event.type - Type of event (e.g., "EventCreated", "EventUpdated")
 * @param {Object} event.payload - Event data payload
 * @throws {Error} If RabbitMQ channel is not initialized
 * @returns {Promise<void>}
 */
export const publishEvent = async (event) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(event)));
};
