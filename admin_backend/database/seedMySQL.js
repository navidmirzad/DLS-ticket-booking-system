import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { publishEvent } from "../util/rabbitmq.js";
dotenv.config();

export async function seedMySQL() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Seeding MySQL...");

    // Clear old data
    await connection.query(`DELETE FROM TICKETS`);
    await connection.query(`DELETE FROM EVENT`);
    await connection.query(`DELETE FROM EVENT_DESCRIPTION`);

    // Insert event descriptions
    const [descResults] = await connection.query(`
      INSERT INTO EVENT_DESCRIPTION (title, image, capacity, date, description, location)
      VALUES 
        ('Summer Beats Festival', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 500, '2025-07-15', 'A music fest with popular artists.', 'Central Park, NY'),
        ('Tech Innovators 2025', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg', 1000, '2025-09-20', 'Annual tech conference with keynotes.', 'SF Convention Center'),
        ('Gourmet Gala', 'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg', 300, '2025-08-05', 'Food and wine tasting event.', 'Chicago Expo Hall')
    `);

    const [[{ insertId: firstDescId }]] = await connection.query(
      "SELECT LAST_INSERT_ID() as insertId"
    );
    const descIds = [firstDescId, firstDescId + 1, firstDescId + 2];

    // Insert events
    const [eventResults] = await connection.query(
      `
      INSERT INTO EVENT (description_id, tickets_available)
      VALUES (?, true), (?, true), (?, true)
    `,
      descIds
    );

    const [[{ insertId: firstEventId }]] = await connection.query(
      "SELECT LAST_INSERT_ID() as insertId"
    );
    const eventIds = [firstEventId, firstEventId + 1, firstEventId + 2];

    // Insert tickets
    await connection.query(
      `
      INSERT INTO TICKETS (event_id, price, type)
      VALUES 
        (?, 99.99, 'STANDARD'), 
        (?, 149.99, 'VIP'),
        (?, 49.99, 'EARLY_BIRD')
    `,
      eventIds
    );

    // Publish each event
    for (let i = 0; i < 3; i++) {
      const [eventDescRows] = await connection.query(
        `
        SELECT * FROM EVENT_DESCRIPTION WHERE id = ?
      `,
        [descIds[i]]
      );

      const event = {
        type: "EventCreated",
        payload: {
          id: eventIds[i],
          title: eventDescRows[0].title,
          description: eventDescRows[0].description,
          location: eventDescRows[0].location,
          image: eventDescRows[0].image,
          date: eventDescRows[0].date,
          capacity: eventDescRows[0].capacity,
          tickets_available: eventDescRows[0].capacity,
        },
      };

      await publishEvent(event);
      console.log(`📤 Published event: ${event.title}`);
    }

    console.log("✅ MySQL seeded and events published.");
  } catch (err) {
    console.error("❌ Error seeding MySQL:", err);
  } finally {
    await connection.end();
  }
}
