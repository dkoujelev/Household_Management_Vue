require("./resources/Bruker");
require("./resources/Kollektiv");
require("./resources/Undergruppe");
require("./resources/Handleliste");
let auth = require("./auth.js");

console.log(auth.generate_sessionId());
