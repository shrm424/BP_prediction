const nodemailer = require("nodemailer");

const sendOTP = async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define HTML content for the OTP email
  const emailHtml = `
    <html>
      <head>
        <style>
          /* Global styles */
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
          }

          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          h1 {
            font-size: 24px;
            color: #333333;
            text-align: center;
            margin-bottom: 10px;
          }

          p {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
          }

          .otp-code {
            font-size: 30px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007BFF;
            padding: 15px;
            text-align: center;
            border-radius: 4px;
            margin-top: 20px;
            margin-bottom: 20px;
            display: inline-block;
            width: 100%;
          }

          .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 30px;
          }

          .footer a {
            color: #007BFF;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Account Verification</h1>
          <p>Hello, ${name},</p>  <!-- Personalized greeting -->
          <p>We received a request to update your profile. Please enter the following OTP to verify your request:</p>
          
          <div class="otp-code">${otp}</div>

          <p>This OTP is valid for 10 minutes. If you didn't request a change, please ignore this email.</p>
          
          <div class="footer">
            <p>Thank you for using our service.</p>
            <p><a href="https://yourwebsite.com">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send the email
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: emailHtml,
  });
};

module.exports = sendOTP;
