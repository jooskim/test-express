#!/usr/bin/env node
var app = require('../app');
var fs = require('fs');
var debug = require('debug')('test-express:server');
var https = require('https');
var port = process.env.PORT || '3000';

app.set('port', port);
app.set('trust proxy', 1);
var server = https.createServer({
    key: fs.readFileSync('/var/app/key.pem'),
    cert: fs.readFileSync('/var/app/cert.pem')
}, app);

server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
