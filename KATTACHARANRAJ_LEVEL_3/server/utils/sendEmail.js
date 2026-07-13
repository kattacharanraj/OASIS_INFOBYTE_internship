const nodemailer = require('nodemailer');

// Send an email. If no email account is set up in the .env file,
// we just print the message in the server console so the demo still works.
async function sendEmail(to, subject, text) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('\n----- EMAIL (demo mode, not really sent) -----');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log(text);
        console.log('---------------------------------------------\n');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    });

    console.log('Email sent to', to);
}

module.exports = sendEmail;
