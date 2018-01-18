let crypto = require('crypto');

let auth = {
  sessions: {},
  newSession(user){
    let id = this.generate_sessionId();
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
  }
};

module.exports = auth;


