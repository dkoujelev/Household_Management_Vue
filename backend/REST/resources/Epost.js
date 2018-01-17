let server = require("../server");
let sendMailScript = require('../../SendMail.js');

// Opprett nytt kollektiv
server.post('rest/epost',function(req, res, next){
    //Hent innholdet i mailen
    let toAddress=req.params.to;
    let fromAddress=req.params.from;
    let subject=req.params.subject;
    let body=req.params.body; 
    
    //Kjør scriptet for å sende mail
    let mailData = {0:toAddress, 
                    1:fromAddress,
                    2:subject,
                    3:body
                  };

    console.log('mailData= {' + mailData[0] + ',' + mailData[1] + ',' + mailData[2] + ',' + mailData[3] + '}');
    
    res.send(sendMailScript(mailData,next));
    next();
    // console.log("myResult: " + myResult);
    // console.log(myResult);
    //return next();
  });