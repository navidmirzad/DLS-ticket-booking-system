import amqp from "amqplib";

let channel;

export const connectRabbit = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue("eventCreated"); // Ensure the queue exists
      await channel.assertQueue("eventUpdated"); // Ensure the queue exists
      await channel.assertQueue("eventDeleted"); // Ensure the queue exists
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
  console.log(event);
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  if(event.type === "EventCreated") {
    channel.sendToQueue("eventCreated", Buffer.from(JSON.stringify(event)));
  }
  if(event.type === "EventUpdated") {
    channel.sendToQueue("eventUpdated", Buffer.from(JSON.stringify(event)));
  }
  if(event.type === "EventDeleted") {
    channel.sendToQueue("eventDeleted", Buffer.from(JSON.stringify(event)));
  }
};