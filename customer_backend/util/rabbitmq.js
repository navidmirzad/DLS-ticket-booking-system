import amqp from 'amqplib';
import dotenv from 'dotenv';


dotenv.config();
let channel;

export const connectRabbit = async () => {
    console.log(process.env.RABBITMQ_URL);
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue('emailQueue');
};

export const sendToQueue = async (data) => {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify(data)));
};