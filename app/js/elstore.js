//////////////////////////////////////////////////////////////////////////////////////////
// Edgeless Store SDK For Node.js
// Code By Oxygen
// Version 1.0.1 // Date 2020/5/21
// 非常简陋
//////////////////////////////////////////////////////////////////////////////////////////
// 目前我们提供了以下函数:
// getList: ƒ getList()
// getListSSL: ƒ getListSSL()
// getAppIndex: ƒ getAppIndex(index)
// getAppIndexSSL: ƒ getAppIndexSSL(index)
// getURL: async ƒ getURL(index, name, version, author)
// getURLSSL: async ƒ getURL(index, name, version, author)
//////////////////////////////////////////////////////////////////////////////////////////
// 示例:
// 调用 aria2 Json-RPC 下载IDM模块 (需要websocket模块) :
// const elstore = require('/elstore.js')
// elstore.getURL(1, 'IDM', '6.36.7.3', 'Cno').then(function (res) {websocket.connect(function() {websocket.send({method : 'aria2.addUri',params : [[res]]}, function(result) {console.log(result);});});})
//////////////////////////////////////////////////////////////////////////////////////////
// 返回 Index 信息:
// const elstore = require('/elstore.js')
// elstore.getList()
//////////////////////////////////////////////////////////////////////////////////////////
// 返回指定 Index 中的 App 信息:
// const elstore = require('/elstore.js')
// elstore.getAppIndex(1)
//////////////////////////////////////////////////////////////////////////////////////////

const request = require('request');
const qs = require('querystring');
const os = require('os');

function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}

async function getList() {
    let options = {
        url: 'https://emapi.tyatt.top/app/app.json' + qs.stringify({
            request_by: 'epm',
        }),
        headers: {
            'User-Agent': 'epmjs' + ';' + '1.0.0' + ';' + 'PC' + ';' + 'PC-Windows' + ';' + os.release() + ';' + 'EdgelessPackageManager',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'emapi.tyatt.top',
        },
        method: 'GET',
    }
    var returnData = {
        error: '',
        response: '',
        content: '',
    }

    await request(options, (e, r, c) => {
        returnData.error = e;
        returnData.response = r;
        returnData.content = JSON.parse(c);
    })

    return returnData;
}

///////////////////////////////////////////
exports.getList = getList;