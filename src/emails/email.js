const nodemailer = require('nodemailer');
const constant=require('../../constants/constant')
class Email{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: constant.username,
              pass: constant.password
            }
        });
    }
    sendEmail(mailOptions,callback){
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              callback(error)
            } else {
              callback('Email sent: ' + info.response)
            }
          });
    }
    
}
  
module.exports=Email
