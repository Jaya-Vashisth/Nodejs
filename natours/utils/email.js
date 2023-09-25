const nodemailer = require('nodemailer');
// const { options } = require('../routes/userRoutes');

const sendEmail = async (options) => {
  //1)Create transpoter
  var transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    //Activate in gmail 'less secure app" option
  });

  //2) Define the email option
  const mailOptions = {
    from: 'Jaya  <Jaya@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3)Actually send the email

  await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
