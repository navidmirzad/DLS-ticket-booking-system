import nodemailer from "nodemailer";

const getTransporter = () => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        logger: true,
        debug: true
    });
    return transporter;
};

export const sendMail = async(message) => {
    console.log("Processing email message:", JSON.stringify(message, null, 2));

    const transporter = getTransporter();

    // Format the date nicely if possible
    let formattedDate = message.event.date;
    try {
        const dateObj = new Date(message.event.date);
        if (!isNaN(dateObj)) {
            formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } catch (e) {
        // Keep original date string if parsing fails
        console.log("Date formatting failed, using original string");
    }

    // Format price with currency symbol
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(message.ticket.price);

    // Create a ticket reference code
    const ticketRef = `TKT-${message.ticket.id.substring(0, 8).toUpperCase()}`;

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Ticket Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4a154b;
                padding: 20px;
                text-align: center;
                color: white;
                border-radius: 5px 5px 0 0;
            }
            .content {
                background-color: #ffffff;
                padding: 30px;
                border-left: 1px solid #e0e0e0;
                border-right: 1px solid #e0e0e0;
            }
            .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666666;
                border-radius: 0 0 5px 5px;
                border: 1px solid #e0e0e0;
            }
            .ticket-info {
                background-color: #f9f9f9;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
            }
            .ticket-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                border-bottom: 1px solid #eeeeee;
                padding-bottom: 10px;
            }
            .ticket-label {
                font-weight: bold;
                color: #666666;
            }
            .ticket-value {
                text-align: right;
            }
            .btn {
                display: inline-block;
                background-color: #4a154b;
                color: white;
                text-decoration: none;
                padding: 12px 25px;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
            }
            .event-details {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #eeeeee;
            }
            .important-note {
                background-color: #fff8e6;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Ticket Confirmation</h1>
                <p>Thank you for your purchase!</p>
            </div>
            
            <div class="content">
                <p>Hello,</p>
                
                <p>Your ticket purchase was successful! We're excited to confirm your ticket for <strong>${message.event.title}</strong>.</p>
                
                <div class="ticket-info">
                    <div class="ticket-row">
                        <span class="ticket-label">Ticket Reference:</span>
                        <span class="ticket-value">${ticketRef}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Event:</span>
                        <span class="ticket-value">${message.event.title}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Date & Time:</span>
                        <span class="ticket-value">${formattedDate}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Location:</span>
                        <span class="ticket-value">${message.event.location}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Ticket Type:</span>
                        <span class="ticket-value">${message.ticket.type}</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-label">Price:</span>
                        <span class="ticket-value">${formattedPrice}</span>
                    </div>
                </div>
                
                <a href="#" class="btn">View My Tickets</a>
                
                <div class="event-details">
                    <h3>Event Details</h3>
                    <p>${message.event.description}</p>
                </div>
                
                <div class="important-note">
                    <strong>Important:</strong> Please bring a photo ID and your ticket reference number with you to the event.
                </div>
                
                <p>If you have any questions about your ticket or the event, please contact our support team.</p>
                
                <p>We look forward to seeing you there!</p>
                
                <p>Best regards,<br>The Events Team</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Events DLS. All rights reserved.</p>
                <p>This email was sent to ${message.to}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: '"Events DLS" <noreply@eventsdls.com>',
        to: message.to,
        subject: `Your Ticket Confirmation - ${message.event.title}`,
        html: emailHtml
    });

    console.log("Confirmation email sent to:", message.to);
};