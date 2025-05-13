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
        if(msg) {
            try {
                const content = JSON.parse(msg.content.toString());
                console.log("MSG: ", content);
                await createEvent(content.payload);
                channel.ack(msg)
            } catch(error) {
                console.error("Event created error: ", error);
            }
        }
        
    });

    channel.consume("eventDeleted", async (msg) => {
        if(msg) {
            try {
                const content = JSON.parse(msg.content.toString());
                console.log("MSG: ", content);
                await deleteEvent(content.payload);
                channel.ack(msg)
            } catch(error) {
                console.error("Event deleted error: ", error);
            }
        }
    });

    channel.consume("eventUpdated", async (msg) => {
        if(msg) {
            try {
                const content = JSON.parse(msg.content.toString());
                console.log("MSG: ", content);
                await updateEvent(content.payload);
                channel.ack(msg)
            } catch(error) {
                console.error("Event created error: ", error);
            }
        }
    });

}