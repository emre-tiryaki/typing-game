import nodeMailer from "nodemailer";

export const sendMail = async (email, data) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: data.subject,
    text: data.text,
  };

  // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error Occurred", error);
    }
    console.log("Email sent successfully:", info.response);
  });
};
