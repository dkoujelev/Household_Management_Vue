let server = require("../server");
let sendMailScript = require('../../SendMail.js');
let bcrypt = require('bcrypt');
let randomstring = require('randomstring');

module.exports = function(connection, server){

  // Opprett nytt kollektiv
  server.post('rest/epost',function(req, res, next){

    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid_to = regex.test(req.params.to);
    let vaild_from = regex.test(req.params.from);

    if(!valid_to || !valid_from){
      res.send(null);
      return next();
    }

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

      //console.log('mailData= {' + mailData[0] + ',' + mailData[1] + ',' + mailData[2] + ',' + mailData[3] + '}');

    sendMailScript(mailData,(response)=>{
      res.send(response);
      return next();
    });
    });

  // Forventet input:
  //
  // {epost: 'eksempel@test.com'}
  // Returnerer {sent: true} hvis det gikk, {sent: false} hvis det ikke gikk.
  server.post('rest/forgottenPassword',(req,res,next) => {

    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.body.epost],(err,rows,fields) => {
      if(err || rows.length < 1){
        console.log(err);
        res.send({sent: false});
        return next();
      }

      let bruker = rows[0];
      let newpass = randomstring.generate({readable: true, length: 8});
      let hash = bcrypt.hashSync(newpass, 10);

      connection.query("UPDATE Bruker SET hashed_passord=? WHERE bruker_id=?", [hash,bruker.bruker_id],(err,rows,fields) => {
        if(err){
          console.log(err);
          res.send({sent: false});
          return next();
        }

        let mailData = {
          0: bruker.epost,
          1:'admin@geving.no',
          2:'Nytt passord',
          3:'Du har fått nytt passord på Household Manager.\n\nDitt nye passord er: ' + newpass
        };

        sendMailScript(mailData,response =>{
          res.send({sent: true});
          return next();
        });
      });
    });
  })
};
