const https = require('https');
const fs = require("fs");
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

// Serve up build folder
var serve = serveStatic('build', { index: ['index.html', 'index.htm'] })

// Create server
const server = https.createServer({
    pfx: fs.readFileSync('./cert/CSSTUD.pfx'),
    passphrase: 'Bamba@CS22'
}, function onRequest(req, res) {
    serve(req, res, finalhandler(req, res))
});

// Listen
server.listen(443)

console.log('Server running on port 443');