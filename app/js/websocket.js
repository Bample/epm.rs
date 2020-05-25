const WebSocketClient = require('websocket').client;

wsclient = new WebSocketClient();
var conn;
var cb;
var cbmap = {};

wsclient.on('connect', function(connection) {
    console.log('INFO: WebSocket client connected');
    connection.on('error', function(error) {
        console.error("ERROR: Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('INFO: Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var data = JSON.parse(message.utf8Data);
            if (typeof cbmap[data.id] === 'function') {
                var result = {
                    obj: data,
                    err: data.error ? new Error(data.error.message) : false
                };
                cbmap[data.id](result);
            }
            delete cbmap[data.id];
        }
    });

    conn = connection;
    if (typeof cb === 'function') {
        cb();
    }
});

wsclient.on('connectFailed', function(error) {
    console.error('ERROR: Client Error: ' + error.toString());
});

function ws_connect(url, callback) {
    cb = callback;
    wsclient.connect(url);
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function ws_send(command, callback) {
    var id = uuid();
    if (typeof callback === 'function') {
        cbmap[id] = callback;
    }

    command.jsonrpc = '2.0';
    command.id = id;
    conn.sendUTF(JSON.stringify(command));
}




exports.connect = ws_connect;
exports.send = ws_send;