const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendRegistrationEmail = async (to, link) => {
  await transporter.sendMail({
    from: '"Team Sajan" <no-reply@teamsajan.com>',
    to,
    subject: 'Complete Your Registration',
    html: `
      <p>Hello,</p>
      <p>Please click the link below to register:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 3 hours.</p>
    `,
  });
};