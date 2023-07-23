import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType , userID}: any) => {
    try {
        // create a hashed token
      const hashedToken = await bcryptjs.hash(userID.toString(), 10);

      if(emailType === 'VERIFY') {
        await User.findByIdAndUpdate(userID, {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000
          })
      } else if (emailType === 'RESET') {
        await User.findByIdAndUpdate(userID, {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000
          })
      }

      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "76f28cd45bbf33",
          pass: "4cfee20708d519"
          // TODO: add these credentials in .env file
        }
      });

      const mailOptions = {
        from: 'cyrilheike@yahoo.com',
        to: email,
        subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
        here</a> 
        to ${emailType === 'VERIFY' ? "verify your email": "reset your password"}</p>`
      }

     const mailResponse = await transport.sendMail(mailOptions);
     return mailResponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}