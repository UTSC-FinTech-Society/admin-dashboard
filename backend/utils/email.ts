import nodemailer from "nodemailer";

export const memberEmailTemplate = (name: string) => {
  return `
        Hello ${name},
        <br><br>
        Thank you for signing up for our membership!
        <br><br>
        Please join our discord server to meet other FTS members and stay updated
        about available opportunities and our upcoming events. You will also get exclusive
        support from our club and be the first ones to know about what's going on in the
        FinTech industry.
        <br><br>
        Discord Link: <a href='https://discord.gg/ANEnxS7up4'>https://discord.gg/ANEnxS7up4</a>
        <br><br>
        Sincerely,<br>
        UTSC FinTech Society
    `;
};

const sendEmail = (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`[nodemailer]: Error: ${error}`);
    } else {
      console.info(
        `[nodemailer]: Email <to: ${mailOptions.to}, subject: ${mailOptions.subject}> sent: ${info.response}`
      );
    }
  });
};

export default sendEmail;
