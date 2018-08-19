const thrift = require('thrift');
const path = require('path')
const fs = require('fs');
const ShareMgnt = require('../gen-node/ncTShareMgnt');


/**
 * 客户端升级包上传
 */
const clientUpload = async function (req, res) {
    // 上传的客户端升级包
    const [file] = req.files
    // 客户端升级包路径
    const filepath = path.resolve(__dirname, file.path)

    const connection = thrift.createConnection(req.headers['x-tclient-addr'], 9600)
    const transport = new thrift.TBufferedTransport(connection)
    const protocol = new thrift.TJSONProtocol(transport)
    const client = thrift.createClient(ShareMgnt, connection)

    connection.on('error', error => {
        try {
            // 删除升级包
            fs.unlinkSync(filepath)
            fs.rmdirSync(file.destination)
        }
        catch (err) {
        }

        res.send(JSON.stringify(error))
    })

    let response

    try {
        // 调用上传客户端升级包的接口
        const ret = await client.UploadClientUpdatePackage(filepath)
        response = null
    } catch (ex) {
        res.set('Content-Type', 'application/vnd.apache.thrift.json');
        res.status(500)
        response = ex
    } finally {
        // 关闭连接
        connection.end()

        try {
            // 删除升级包
            fs.unlinkSync(filepath)
            fs.rmdirSync(file.destination)
        }
        catch (err) {
        }

        // 为了解决跨域上传问题
        res.set('Access-Control-Allow-Origin', req.headers['origin']);
        res.send(JSON.stringify(response))
    }
}

//导出对象
module.exports = clientUpload;