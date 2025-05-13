import amqp from "amqplib";
import { createEvent, updateEvent, deleteEvent } from "../service/eventService.js";

let channel;

export const connectRabbit = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue("eventCreated");
    await channel.assertQueue("eventDeleted");
    await channel.assertQueue("eventUpdated");
}

export const consume = async() => {
    if(!channel) {
        console.error("No channel");
        return;
    }
    
    channel.consume("eventCreated", async (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("MSG: ", content);
        // CREATE THE EVENT
        await createEvent(content.payload);
    });

    channel.consume("eventDeleted", async (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("MSG: ", content);
        // DELETE THE EVENT
        await deleteEvent(content.payload);
    });

    channel.consume("eventUpdated", async (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("MSG: ", content);
        // UPDATE EVENT
        await updateEvent(content.payload);
    });

    

}