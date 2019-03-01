
var cine = require("@cineana/cineserver-base");
cine.addModule(__dirname + "/");
var options =  {
   port: 3088,
    sslport: 0,
    group: "Gui Dev",
    auth: 0,
    appconf: {  showapps: "1" },
    showapps: "1",
    modules: [
        "cinegui"
    ]
}

cine.start( options, function() {
});


