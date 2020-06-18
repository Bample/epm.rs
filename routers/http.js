const express = require('express');
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

router.get('/', async(req,res) => {
    console.log(_cc.green(_cc.bold('请求已接受!')),_cc.blackBright(_cc.italic(' ( path = '+req.path+', message = '+JSON.stringify(req.body)+' )')))
    console.log(_cc.green(_cc.bold('设置Cookie...')),_cc.blackBright(_cc.italic(' ( Header: { Set-Cookie: Cno=homo;homo=114514191981 } )')))
    res.header('set-cookie','Cno=homo; homo=1145141919810')
    res.status(200).send('<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><style>    html,body{      height: 100vh;      width: 100vw;      margin: 0;      padding: 0;      background: #ffffff;      text-align: center;      margin-top:30px;      overflow: hidden;    }    *{      color:rgb(100,100,100);    }    a{      color:#42b983;    }    ul,li{      margin: 0;    }    ul{      margin-left: -40px;      line-height: 30px;    }    li{      list-style: none;    }</style><title>Edgeless Package Manager API Server</title></head><body><h1>EPM API Server</h1>当你看到这个页面时，这个服务已经成功跑起来啦~ <a href="https://home.edgeless.top/" target="_blank">PE本家</a><br><h3>当前运行环境: </h3>Node.js: '+process.versions.node+'<br>V8: '+process.versions.v8+'<br>OpenSSL: '+process.versions.openssl+'</body></html>')
    console.log(_cc.green(_cc.bold('已回复信息')),_cc.blackBright(_cc.italic('  ( '+'<HTML>'+' )')))
})

router.all('/request/', async(req, res) => {
    console.log(_cc.green(_cc.bold('请求已接受!')),_cc.blackBright(_cc.italic(' ( path = '+req.path+', message = '+JSON.stringify(req.body)+' )')))
 let tempStatus = await JSON.parse(fs.readFileSync('./config.json').toString())
 let clientID;
 if(req.body.id == null){clientID = 'null'}else{clientID = req.body.id}
 if (tempStatus.server.status == true) {
     try {
        let sendMessage = {
            jsonrpc: '2.0',
            id: clientID,
            result: [{err: 'OK'},{code: 200}]
        }
         res.set('Content-Type','application/json')
         res.status(200).send(JSON.stringify(sendMessage))
         console.log(_cc.green(_cc.bold('已回复信息')),_cc.blackBright(_cc.italic('  ( '+JSON.stringify(sendMessage)+' )')))
     } catch(err) {
         console.error(_cc.red(_cc.bold('回复错误! ')))
         console.error(err)
     }
 
 } else {
     try {
        let sendMessage = {
        jsonrpc: '2.0',
        id: 'null',
        error: {
            message: [{err: 'notOK'},{code: 500}],
            code: 500
        }
    }
         res.set('Content-Type','application/json')
         res.status(500).send(JSON.stringify(sendMessage))
         console.log(_cc.green(_cc.bold('已回复信息')),_cc.blackBright(_cc.italic('  ( '+JSON.stringify(sendMessage)+' )')))
     } catch(err) {
         console.error(_cc.red(_cc.bold('回复错误! ')))
         console.error(err)
     }
 
 }
 })
 
 
router.all('/favicon.ico', async(req, res) => {
     console.log(_cc.green(_cc.bold('请求已接受!')),_cc.blackBright(_cc.italic(' ( path = '+req.path+', message = '+JSON.stringify(req.body)+' )')))
     res.status(200).send(fs.readFileSync('./favicon.ico'))
     console.log(_cc.green(_cc.bold('已开始文件流')),_cc.blackBright(_cc.italic('  ( '+'<FileStream>'+' )')))
 })
  
module.exports = router;