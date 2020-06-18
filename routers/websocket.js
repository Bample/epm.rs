const express = require('express');
const expressWS = require('express-ws')
const router = express.Router();
const bodyParser = require('body-parser')
const _cc = require('cli-color')
const fs = require('fs')
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
router.use(bodyParser.json())

router.use((req, res, next) => {
    let protocol;
    if (req.headers['upgrade'] == "websocket") {
        if (req.protocol == 'http') {
            protocol = 'Websocket'
        } else if (req.protocol == 'https') {
            protocol = 'Websocket - TLS'
        }
    } else if (req.protocol == 'http') {
        protocol = 'HTTP'
    } else if (req.protocol == 'https') {
        protocol = 'HTTPS'
    }
    console.log('')
    console.log(_cc.green(_cc.bold('监听到新连接! ('+protocol+' Protocol)')))
    console.log(_cc.blackBright(_cc.italic('Connection Info: ')))
    console.log(_cc.blackBright(_cc.italic('    Connect IP (Remote): '+req.ip)))
    console.log(_cc.blackBright(_cc.italic('    Connect IP (X-Forwarded): '+req.headers['x-forwarded-for'])))
    console.log(_cc.blackBright(_cc.italic('    Connect Path: '+req.path)))
    console.log(_cc.blackBright(_cc.italic('    Connect Protocol: '+protocol)))
    console.log(_cc.blackBright(_cc.italic('    Connnect Key: '+req.headers['sec-websocket-key'])))
    console.log('')
    console.log(_cc.blackBright(_cc.italic('    Connect Headers: ')))
    console.log(_cc.blackBright(_cc.italic('        Content-Type:',JSON.stringify(req.get('Content-Type'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        User-Agent:',JSON.stringify(req.get('User-Agent'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Method:',req.method)))
    console.log(_cc.blackBright(_cc.italic('        Cookie:',JSON.stringify(req.get('Cookie'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Referer:',JSON.stringify(req.get('Referer'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Accept:',JSON.stringify(req.get('Accept'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Accept-Encoding:',JSON.stringify(req.get('Accept-Encoding'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Accept-Language:',JSON.stringify(req.get('Accept-Language'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Origin:',JSON.stringify(req.get('Origin'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        Authority:',JSON.stringify(req.get('Authority'), null, 8))))
    console.log(_cc.blackBright(_cc.italic('        All Headers:',JSON.stringify(req.headers, null, 8))))
    console.log('')
    return next();
});

expressWS(router)

router.ws('/', (ws, req) => {
    ws.send('hello')
}) 


router.ws('/status/', async(ws, req) => {
    console.log(_cc.green(_cc.bold('请求已接受!')),_cc.blackBright(_cc.italic(' ( path = '+req.path+', message = '+JSON.stringify(req.body)+' )')))
    let tempStatus = await JSON.parse(fs.readFileSync('./config.json').toString())
    let clientID;
    if(req.body.id == null){clientID = 'null'}else{clientID = req.body.id}
    if (tempStatus.server.status == true) {
        let sendMessage = {
            jsonrpc: '2.0',
            id: clientID,
            result: [{err: 'OK'},{code: 200}]
        }

        ws.send(JSON.stringify(sendMessage), async(err) => { 
             if (err == null) {
                 console.log(_cc.green(_cc.bold('已回复信息')),_cc.blackBright(_cc.italic('  ( '+JSON.stringify(sendMessage)+' )')))
             } else {
                 console.error(_cc.red(_cc.bold('回复错误! ')))
                 console.error(err)
             }
             await ws.close()
             console.log(_cc.green(_cc.bold('连接已关闭')),_cc.blackBright(_cc.italic('  ( null )')))
         })
} else {
    let sendMessage = {
        jsonrpc: '2.0',
        id: 'null',
        error: {
            message: [{err: 'notOK'},{code: 500}],
            code: 500
        }
    }
ws.send(JSON.stringify(sendMessage), async(err) => { 
    if (err == null) {
    console.log(_cc.green(_cc.bold('已回复信息')),_cc.blackBright(_cc.italic('  ( '+JSON.stringify(sendMessage)+' )')))
    } else {
    console.error(_cc.red(_cc.bold('回复错误! ')))
    console.error(err)
    }
    await ws.close()
    console.log(_cc.green(_cc.bold('连接已关闭')),_cc.blackBright(_cc.italic('  ( null )')))

})
}})

module.exports = router;