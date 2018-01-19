module.exports = function(connection,server){
  require("./resources/Bruker")(connection,server);
  require("./resources/Kollektiv")(connection,server);
  require("./resources/Undergruppe")(connection,server);
  require("./resources/Handleliste")(connection,server);
  require("./resources/Innmelding")(connection,server);
  require("./resources/Epost")(connection,server);
  require("./resources/Melding")(connection,server);
  require("./resources/Gjoremal")(connection,server);
  require("./resources/Gjoremalsliste")(connection,server);
  require("./resources/Gjeld")(connection,server);
  require("./resources/Kostnad")(connection,server);
};


