const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsnoobs@gmail.com',
    pass: 'olasunkanmi',
  },
});

module.exports.sendMail = (params) => {
  try {
    let info = transporter.sendMail({
      from: 'process.env.EMAIL',
      to: params.to,
      subject: 'Hello ✔',
      html: `
            <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome to the club.</h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
       </div>
            `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
