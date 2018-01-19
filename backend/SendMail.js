var nodemailer = require('nodemailer');
var SMTPserverName='smtp.altibox.no';
var SMTPuserName='geving@ntebb.no';   // Be nice!
var SMTPpassword='fuckNTE00';         // Don't abuse this info!
var MailRecipient='harald@geving.no';
var MailSender='geving@ntebb.no';
var MailSubject='This is a hard coded subject';
var MailBody='This is a hard coded body';

var mailOptions = {
  from: MailSender,
  to: MailRecipient,
  subject: MailSubject,
  text: MailBody
};

var transporter = nodemailer.createTransport({
  //service: 'gmail', // It's possible to replace 'host' and 'port' and 'secure' with this 'service' entry.
  host: SMTPserverName,
  port: 465,
  secure:true,
  auth: {
    user: SMTPuserName,
    pass: SMTPpassword
  }
});

var doMail = function(mailData,next){
    mailOptions = {
      to: mailData[0],
      from: mailData[1],
      subject: mailData[2],
      text: mailData[3]
    };

    transporter.sendMail(mailOptions, function(error, info){
      console.log('Performing the sendMail function...');
      if (error) {
        console.log(error);
        res.send(error);
        return next;
      } else {
        console.log('Email sent! (' + info.response + ')');
        res.send(info.response);
        return next;
      };
    });
  };

module.exports= doMail;