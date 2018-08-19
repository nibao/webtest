const QRCode = require('qrcode');
const fs = require('fs');

const getQRCode = async function(req, res) {

    //是否存在当前路径
    if (!fs.existsSync('./tmp')) {
        // 创建路径
        fs.mkdirSync('./tmp');
    }

    if (req.query.format === 'svg') {

        const pathSvg = `./tmp/${req.query.name}.svg`;

        // 生成svg格式的二维码
        QRCode.toFile(pathSvg, req.query.text, {
            type: 'svg'
        }, (err) => {
            if (err) {
                res.status(500)
                res.send(err)
            }
            try {

                // 读取svg文件
                fs.readFile(pathSvg, (error, buffer) => {
                    if (error) {
                        res.status(500);
                        res.send(error);
                    }
                    res.set({
                            'Content-Type': 'application/octet-stream',
                            'Cache-Control': 'public',
                            'Content-Disposition': `attachment; filename="${req.query.name}.svg"; filename*=utf-8''${req.query.name}.svg`
                        })
                        // 发送二进制文件
                    res.send(buffer)
                        // 删除svg文件
                    fs.unlinkSync(pathSvg)
                })
            } catch (ex) {
                fs.unlinkSync(pathSvg)
                res.status(500)
                res.send(ex)
            }
        })
    } else {

        const pathPng = `./tmp/${req.query.name}.png`;

        //生成png二维码图片
        QRCode.toFile(pathPng, req.query.text, {
            type: 'png',
            width: 1000
        }, (err) => {
            if (err) {
                res.status(500);
                res.send(err);
            }
            try {

                // 读取png图片
                fs.readFile(pathPng, (error, buffer) => {
                    if (error) {
                        res.status(500);
                        res.send(error)
                    }
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Cache-Control': 'public',
                        'Content-Disposition': `attachment; filename="${req.query.name}.png"; filename*=utf-8''${req.query.name}.png`
                    })

                    // 发送图片
                    res.send(buffer)

                    // 删除图片
                    fs.unlinkSync(pathPng)
                })
            } catch (ex) {
                fs.unlinkSync(pathPng)
                res.status(500)
                res.send(ex)
            }
        })
    }
}

module.exports = getQRCode;