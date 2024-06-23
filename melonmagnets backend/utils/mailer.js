const nodeMailer = require('nodemailer');

const sendMail = async (data) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: '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'
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