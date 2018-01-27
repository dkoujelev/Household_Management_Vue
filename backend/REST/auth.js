let crypto = require('crypto');
let server = require('./server');

let auth = {
  sessions: {},
  newSession(user){
    let id = this.generate_sessionId();
    console.log('adding session ' + id + ' for ' + user.epost);
    this.sessions[id] = user;
    return id;
  },
  getSession(session_id){
    if(session_id in this.sessions)
      return this.sessions[session_id];
    else return null;
  },
  generate_sessionId(){
    let sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
  },
  hasSession(session_id){
    return (session_id in this.sessions);
  },
  dropSession(session_id){
    if(session_id in this.sessions){
      //console.log('deleting session ' + session_id + ' for ' + this.sessions[session_id].epost);
      delete this.sessions[session_id];
    }
  },
  checkThatSessionExists(req, res){
    if(!('sessionId' in req.cookies) || req.cookies.sessionId === '' || !this.hasSession(req.cookies.sessionId)){
      //console.log("REST access has been denied because user doesn't have session on server");
      res.send(403);
      return false;
    }
    return true;
  },
  checkThatSessionHasUserId(req,res,next,user_id){
    if(server.loginEnabled){
      let user = this.getSession(req.cookies.sessionId);
      if(user.bruker_id !== user_id){
        res.send(403);
        return next();
      }
    }
  },
  clearLogins(){
    this.sessions = {};
  }
};

module.exports = auth;


