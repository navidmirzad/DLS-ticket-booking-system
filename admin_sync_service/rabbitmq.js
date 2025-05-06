import amqp from "amqplib";

let channel;

export const connectRabbit = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("eventQueue"); // Ensure the queue exists
};

export const publishEvent = async (event) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(event)));
};
