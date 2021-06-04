const nodemailer = require('nodemailer');

require('dotenv').config();

const { MAIL_ADMIN, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_SECURE, MAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE, // use TLS
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

const EmailDetails = (title, message) => {
    const body = `
      <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="description" content="">
              <meta name="author" content="">
              <title>${title}</title>
          </head>
  
          <body style="max-width: 600px;margin: 10px auto;padding: 70px;border: 1px solid #ccc;background: #ffffff;color: #4e4e4e;">
              <div>
                  ${message}
                  <p style="margin-bottom: 2em;line-height: 26px;font-size: 14px;">
                    Glade Contact, <br>
                  </p>
              </div>
          </body>
          </html>
      `;
    return body
  };

const sendMail = async (to, subject, body) => {
  const message = {
    from: MAIL_ADMIN,
    to,
    subject,
    html: EmailDetails(subject, body)
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendMail;
