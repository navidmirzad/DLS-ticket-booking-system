import amqp from "amqplib";
import { sendMail } from "./mail.js";

let channel;

export const connect = async() => {
    console.log(process.env.RABBITMQ_URL);
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue('emailQueue');
}

export const consumeQueue = async() => {
    if(!channel) {
        throw new Error("Not connected to rabbmitmq");
    }

    await channel.consume("emailQueue", async (msg) => {
        if (msg !== null) {

            const message = JSON.parse(msg.content.toString());
            await sendMail(message);
        }
    }, { noAck: true });
}