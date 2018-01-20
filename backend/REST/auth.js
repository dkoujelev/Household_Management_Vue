let crypto = require('crypto');

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
      console.log('deleting session ' + session_id + ' for ' + this.sessions[session_id].epost);
      delete this.sessions[session_id];
    }
  }
};

module.exports = auth;


