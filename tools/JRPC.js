async function readJsonRPCASync(clientStr) {
    try {
        return await JSON.parse(clientStr)
    } catch(err) {
        return new Error(err)
    }
}

async function writeCallback(result, clientID, code, data, err, errmsg) {
    let main;
    if (err == true) {
        return await JSON.stringify({
            jsonrpc: '2.0',
            id: clientID,
            error: {
                code: code,
                message: errmsg
            },
            data: data
        })
    } else if (err == false) {
         return await JSON.stringify({
            jsonrpc: '2.0',
            id: clientID,
            result: result,
            data: data,
            code: code
        })
    } else {
        return new Error('"Err" Invalid')
    }
}

module.exports.writeCallback = writeCallback;
module.exports.readJsonRPC = readJsonRPCASync;

