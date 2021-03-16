const killp = require('kill-port');
killp(80, "tcp");
killp(3000, "tcp");

const api = require("./api.js");
const control = require("./control.js");

api.setProp(control);

let id = control.make(25565, "spigot", 1);