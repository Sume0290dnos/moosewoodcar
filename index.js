const killp = require('kill-port');
killp(80, "tcp");
killp(3000, "tcp").then(function() {
    const control = require("./control.js");
    const api = require("./api.js");
    api.setProp(control);

    let id = control.make(25565, "spigot", 1);
});