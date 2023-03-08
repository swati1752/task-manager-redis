const nodemailer = require('nodemailer');
// if(process.env.NODE_ENV !== 'production')
require('dotenv').config()

async function sendWelcomeEmail(email , name ){

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 465,
  secure: true, 
  service:'gmail',
  auth: {
    user: process.env.SENDER_EMAIL, 
    pass: process.env.SENDER_PASS, 
    authentication:'plain'
  },
  tls : {
      rejectUnauthorized:false
  }
});

const info = await transporter.sendMail({
    from: "TEAM CONATUS", // sender address
    // to: process.env.RECEIVE_MAIL.split(','), 
    to: email,
    subject: "Welcome Email", 
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital@0;1&family=Poppins:wght@400;500;600;700&family=Proza+Libre&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
        <title>Mail</title>
    </head>
    <body style="margin: 0px; padding:0px;">
        <div style="font-family: 'Poppins', sans-serif; background-color: #F4F9F9 ">
            <hr style="border: none; width: 100%; height: 5px; background-color: #FDA92F; color: #fcb029; " >
            <br>
            <p>Thanyou for connecting with us ${name} ☺️</p><br>
            <hr style="border: none; width: 100%; height: 5px; background-color: #FDA92F; color: #fcb029; " >
        </div>
    </body>
    </html>` // html body

  });
}
// sendVerificationEmail()
// .catch(console.error)

module.exports = { sendWelcomeEmail }
