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
    })
    return transporter;
}

    

export const sendMail = async(message) => {
    console.log(message);
    console.log(process.env.MAIL_USERNAME)
    console.log(process.env.MAIL_PASSWORD)
    console.log(process.env.MAIL_HOST);
    const transporter = getTransporter();

    await transporter.sendMail({
        from: "TICKET DLS",
        to: message.to,
        subject: message.type,
        html: 
            `<h3>Ticket to ${message.event.title} bought!</h3>` +
            `<h3>The event starts at ${message.event.date}</h3>`
    });

    console.log("Message sent: ", message.to);
}