/*
import * as wserver from 'nodejs-websocket';
import * as _cc from 'cli-color';
*/

const _cc = require('cli-color');
const fs = require('fs');
const os = require('os');
const http = require('http');
const https = require('https');


const privateKey  = fs.readFileSync('./certs/private.key', 'utf8');
const certificate = fs.readFileSync('./certs/full_chain.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const express = require('express');
const expressWs = require('express-ws');
const app = new express();
const appSec = new express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const httpRouter = require('./routers/http');
const wsRouter = require('./routers/websocket');

const appVersion = '2.3.51';

console.log('')
console.log(_cc.cyan(_cc.bold('Edgeless Package Manager Server - For Websocket / HTTP Protocol')))
console.log(_cc.green(_cc.italic('Version '+appVersion+' - Code By Oxygen')))
console.log('')
console.log(_cc.blackBright(_cc.italic('System Platform:',os.platform+'_'+os.release+'_'+os.arch)))
console.log(_cc.blackBright(_cc.italic('Process PID:',process.pid)))
console.log(_cc.blackBright(_cc.italic('System Hostname:',os.hostname)))
console.log(_cc.blackBright(_cc.italic('Node Directory:',process.execPath)))
console.log(_cc.blackBright(_cc.italic('Node Directory:',__dirname)))
console.log(_cc.blackBright(_cc.italic('Runtime Versions: '+JSON.stringify(process.versions, 0, 4))))





async function __startMain() {

    const serverConfig = await JSON.parse(await fs.readFileSync('./config.json').toString())
    /*
    var wsHost = await serverConfig.server.config.websocket.host
    var wsPort = await serverConfig.server.config.websocket.port
    */
    var httpHost = await serverConfig.server.config.http.host
    var httpPort = await serverConfig.server.config.http.port
    var httpsHost = await serverConfig.server.config.https.host
    var httpsPort = await serverConfig.server.config.https.port

async function mainHttpServer() {

    let httpServ = await httpServer.listen(httpPort, function() {
        console.log(_cc.green(_cc.italic('HTTP Server is Listening On http://'+httpHost+':'+httpPort+'/')))
    });

    
    let httpsServ = await httpsServer.listen(httpsPort, function() {
        console.log(_cc.green(_cc.italic('HTTPS Server is Listening On https://'+httpsHost+':'+httpsPort+'/')))
    });
    

   await expressWs(app, httpServ);
   console.log(_cc.green(_cc.italic('Websocket Server is Listening On ws://'+httpHost+':'+httpPort+'/')))

   
   await expressWs(appSec, httpsServ);
   console.log(_cc.green(_cc.italic('Websocket - TLS Server is Listening On wss://'+httpsHost+':'+httpsPort+'/')))
   
    
   app.use('/', httpRouter);

   app.use('/', wsRouter)
   appSec.use('/', wsRouter)
    
}

mainHttpServer()
};__startMain()

 