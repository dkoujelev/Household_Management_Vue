let server = require("../server");
let connection = require("../connection");

// Hent alle innmeldinger
server.get('rest/innmelding/',function(req, res, next){
    //[{"bruker_id":1,"kollektiv_id":1,"status_admin":1,"status_bruker":9,"dato_svar_admin":"2018-01-15T11:12:12.000Z","dato_svar_bruker":null,"aktiv":1,"notat_admin":"Kommer flyttende i mars.","notat_bruker":null},
    // {"bruker_id":2,"kollektiv_id":1,"status_admin":1,"status_bruker":1,"dato_svar_admin":"2018-01-12T09:21:00.000Z","dato_svar_bruker":"2018-01-12T13:22:20.000Z","aktiv":0,"notat_admin":null,"notat_bruker":null}]
    connection.query("SELECT * FROM Innmelding", function(err, rows, fields){
      res.send(err ? err : rows);
      return next();
    });
  });  

// Hent en bestemt innmelding
server.get('rest/innmelding/:kollektiv_id',function(req, res, next){
    if(req.params.kollektiv_id){
        connection.query("SELECT * FROM Innmelding WHERE bruker_id=? AND kollektiv_id=?", [req.params.bruker_id, req.params.kollektiv_id], function(err, rows, fields){
            res.send(err ? err : (rows.length == 1 ? rows[0] : null));
            return next();
        });
    }else{
        //console.log('Fant ingen innmelding for bruker ' + req.params.bruker_id + ' til kollektiv ' + req.params.kollektiv_id + '...');
        res.send(null);
        return next();
    };
});


// Legg til innmelding
server.post('rest/innmelding/',function(req,res,next){
  connection.query("INSERT INTO Innmelding SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Oppdater en innmelding
server.put('rest/innmelding/',function(req,res,next){

/* VB-pseudo code for funksjonalitet

if status_admin == 1 andalso status_bruker == 1 then
    //Begge har sagt "ja".
    -Legg til bruker
    -Sett innmelding.active=false
    -Sett riktige verdier på timestamp(s)
elseif
    //Minst én av partene har sagt "nei"
    -Sett innmelding.active=false
    -Sett riktige verdier på timestamp(s)
end if
*/


    if(req.params.kollektiv_id){
        connection.query("UPDATE Innmelding SET ? WHERE kollektiv_id=?", [req.body, req.body.bruker_id], function(err, rows, fields){
            res.send(err ? err : rows);
            return next();
        });
    }else{
        res.send(null);
        return next();
    };
});