var dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");


//transporter setup

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_TEST,
        pass: process.env.EMAIL_TEST_APP_PSWD
    },
})

///

module.exports = {
    verifyUserEmail: async function verifyUserEmail(userEmail, s, t) {
        try {
            let info = await transporter.sendMail({
                from: process.env.EMAIL_TEST,
                to: userEmail,
                subject: s,
                text: t
            })
        } catch (err) {
            console.log(err)
        }
    }
}
