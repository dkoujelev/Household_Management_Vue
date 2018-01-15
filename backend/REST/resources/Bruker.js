let server = require("../server");
let connection = require("../connection");
let auth = require("../auth.js");

// Hent en bestemt bruker
server.get('rest/bruker/:bruker_id',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE bruker_id=?", [req.params.bruker_id], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Finn bruker med bestemt epost
server.get('rest/bruker/:epost',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function(err, rows, fields){
    res.send(err ? err : (rows.length == 1 ? rows[0] : null));
    return next();
  });
});

// Legg til bruker
server.post('rest/bruker/',function(req,res,next){
  connection.query("INSERT INTO Bruker SET ?", req.body, function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Hent alle brukere
server.get('rest/bruker/',function(req, res, next){
  connection.query("SELECT * FROM Bruker", function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Sjekke om en epost er registrert
server.get('rest/brukerepost/:epost',function(req, res, next){
  connection.query("SELECT * FROM Bruker WHERE epost=?", [req.params.epost], function(err, rows, fields){
    res.send({exists: rows.length == 1});
    return next();
  });
});

// Hent alle brukere i et bestemt kollektiv
server.get('rest/brukereIKollektiv/:kollektiv_id',function(req,res,next){
  connection.query("SELECT Bruker.* FROM Bruker " +
    "INNER JOIN Bruker_Kollektiv ON Bruker.bruker_id = Bruker_Kollektiv.bruker_id " +
    "INNER JOIN Kollektiv ON Bruker_Kollektiv.kollektiv_id = Kollektiv.kollektiv_id " +
    "WHERE Kollektiv.kollektiv_id = ?", req.params.kollektiv_id , function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});

// Oppdater en bruker
server.put('rest/bruker',function(req,res,next){
  connection.query("UPDATE Bruker SET ? WHERE bruker_id=?", [req.body, req.body.bruker_id], function(err, rows, fields){
    res.send(err ? err : rows);
    return next();
  });
});



// Logg inn bruker
server.post('rest/login',function(req,res,next){
  connection.query("SELECT * FROM Bruker WHERE epost=?", [req.body.epost], function(err, rows, fields){

    if(err)
      return next(err);

    if(rows.length == 0){
      // User doesn't exist;
      console.log('user ' + req.body.epost + ' doesn\'t exist!');
      res.send(null);
      return next();
    }

    let bruker = rows[0];

    console.log("seessions: " + JSON.stringify(auth.sessions));
    console.log("cookies: " + JSON.stringify(req.cookies));

    // User already logged in.
    if(auth.getSession(req.cookies['sessionId'])){
      console.log('user ' + bruker.epost + ' already logged in');
      res.send(bruker);
      return next();
    }

    //INSERT PASWORD CHECK W/HASHING HERE
    let passwordMatch = (bruker.hashed_passord === req.body.passord);

    if(passwordMatch){
      console.log('creating session for user ' + bruker.epost);

      res.setCookie('sessionId', auth.newSession(bruker));

      res.send(bruker);
      return next();

    }
    else{
      console.log('wrong password for user ' + req.body.epost);
      res.send(null);
      next();
    }


  });
});
