let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let makereq = async function(url) {
    let r = new XMLHttpRequest();
    r.open("GET", url, false);
    r.send();
}

let getreq = async function(url) {
    let r = new XMLHttpRequest();
    r.onreadystatechange = function() {
        if(r.readyState == 4) {
            return JSON.parse(r.responseText);
        }
    };
    r.send();
    r.open("GET", url, false);
}

module.exports = {
    make: makereq,
    get: getreq,
}