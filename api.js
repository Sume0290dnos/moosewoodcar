let control = null;

let setProp = function(i) {
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


app.listen(3000);

module.exports = {
    setProp: setProp,
    getProp: function() { return control; }
}