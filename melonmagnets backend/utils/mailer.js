const nodeMailer = require('nodemailer');

const sendMail = async (data) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mail = await transporter.sendMail({
            from: `"Melon Magnets" <acmeflare@gmail.com>`,
            to: process.env.SMTP_CLIENT,
            subject: 'Order Received',
            html: data
        });

        console.log('message sent', mail);
        return
    } catch (error) {
        console.log(error);
        return
    }
};

module.exports = { sendMail }