let bcrypt = require('bcrypt');
let auth = require('../auth.js');

module.exports = function(connection, server) {
// Login
  server.post('rest/login', function (req, res, next) {
    connection.query("SELECT * FROM Bruker WHERE epost=?", [req.body.epost], function (err, rows, fields) {

      if (rows.length == 0) {
        console.log('login denied for user ' + req.body.epost + ' (user not found)');
        res.send(null);
        return next();
      }

      let user = rows[0];

      if ('sessionId' in req.cookies && req.cookies.sessionId != '') {
        console.log("session cookie found");
        if (auth.hasSession(req.cookies.sessionId)) {
          // User already logged in!
          console.log('user already logged in with sessionId: ' + req.cookies.sessionId);
          res.send(user);
          return next();
        }
        else {
          console.log("session " + req.cookies.sessionId + " was not found on server!");
          // User had sessionId cookie but server forgot about it. Kill the cookie.
          //res.setCookie('sessionId', '');
        }
      }

      //  Check if there even is a user with this email
      let passord = [req.body.passord] + ""; //               Load password from request (and force to proper string by adding + "")
      let hashed_passord = rows[0].hashed_passord; //          Get the hash returned from DB

      if (bcrypt.compareSync(passord, hashed_passord)) { //    Compare the password to the hash
        // Passwords match

        let session = auth.newSession(user);
        res.setCookie('sessionId', session);
        res.send(user); //                   Log in the user... (But for now, just tell the GUI it's all good!)
        return next();
      } else {
        // Passwords don't match
        console.log('login denied for user ' + req.body.epost);
        res.send(null); //                  Tell the GUI that the password was no good!
        return next();
      }
    });
  });

// Log out user.
  server.post('rest/logout', (req, res, next) => {
    auth.dropSession(req.cookies.sessionId);
    res.setCookie('sessionId', '');
    res.send();
    return next();
  });

// Check if user is already logged in.
  server.get('rest/loggedIn', function (req, res, next) {

    if ('sessionId' in req.cookies && req.cookies.sessionId != '') {
      let user = auth.getSession(req.cookies.sessionId);

      if (user) {
        res.send(user);
        return next();

      }
      else {
        res.setCookie('sessionId', '');
        res.send(null);
        return next();
      }
    }
    else {
      res.send(null);
      return next();
    }
  });
};
