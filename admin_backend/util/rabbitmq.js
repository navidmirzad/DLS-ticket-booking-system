import amqp from "amqplib";

let channel;

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

export const publishEvent = async (event) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(event)));
};
