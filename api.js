let control = null;

let setProp = (i) => {
    control = i;
}

let express = require('express'),
    app = express();

app.on("/api/rcon", (req, res) => {
    if(req.query.command !== undefined && req.query.sid !== undefined) {
        let cmd = req.query.command;
        let sid = req.query.sid;
        control.getRcon(sid).send(cmd);
    }
});

async function f() {
    // const killp = require('kill-port');
    // killp(25564, "tcp");

    app.listen(25564);
}
f();

module.exports = {
    setProp: setProp,
    getProp: function() { return control; }
}