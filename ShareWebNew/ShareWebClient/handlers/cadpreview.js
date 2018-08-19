const fs = require('fs');
const path = require('path');
const thrift = require('thrift');
const ShareMgnt = require('../gen-node/ncTShareMgnt');
const gm = require('gm').subClass({ imageMagick: true });

const waterMark = async function (req, res) {
    const { width, height, name, username, useraccount, textwidth } = req.query

    // 调接口获取textInfos
    const connection = thrift.createConnection('127.0.0.1', 9600)
    const transport = new thrift.TBufferedTransport(connection)
    const protocol = new thrift.TJSONProtocol(transport)
    const client = thrift.createClient(ShareMgnt, connection)

    connection.on('error', error => {
        res.send(JSON.stringify(error))
    })

    // 调用上传客户端升级包的接口
    const { text, user } = JSON.parse(await client.GetDocWatermarkConfig())
    // 关闭连接
    connection.end()

    //  水印信息数组
    let textInfos = formatterTextInfos(text, user, username, useraccount)
    // 居中或者平铺
    const layout = text.layout

    mixWaterMark(textInfos, textwidth, layout, req, res)
}

/**
 * 获取textInfos数组
 * @param {*} text 水印text信息对象
 * @param {*} user 水印user信息对象
 * @param {*} username 水印的username
 * @param {*} useraccount 水印的useraccount
 */
function formatterTextInfos(text, user, username, useraccount) {
    //  水印信息数组
    let textinfos = []
    // 居中或者平铺
    const layout = text.layout
    // 自定义水印
    if (text.enabled) {
        textinfos = [{
            text: text.content.slice(0, 50),
            color: text.color,
            fontSize: text.fontSize,
            transparency: text.transparency + 130
        }]
    }
    // 用户名水印
    if (user.enabled && username && useraccount) {
        username = decodeURIComponent(username)
        useraccount = decodeURIComponent(useraccount)
        textinfos = [...textinfos, {
            text: username.slice(0, 50),
            color: user.color,
            fontSize: user.fontSize,
            transparency: user.transparency + 130
        }, {
            text: useraccount.slice(0, 50),
            color: user.color,
            fontSize: user.fontSize,
            transparency: user.transparency + 130
        }]
    }

    return textinfos
}

/**
 * 根据textInfos生成水印图片
 * @param {*} textInfos 水印文字信息数组
 */
function getSmallWaterImage(textInfos, textwidth) {
    textwidth = parseInt(textwidth)
    // 图片宽度
    let imageWidth = 0
    // 图片高度
    let imageHeight = 0

    if (textwidth) {
        let maxFontSize = 0
        textInfos.forEach(({ fontSize, text }) => {
            if (fontSize > maxFontSize) {
                maxFontSize = fontSize
            }

            imageHeight = imageHeight + fontSize * 1.5
        })
        imageWidth = textwidth + maxFontSize
    } else {
        textInfos.forEach(({ fontSize, text }) => {
            if (imageWidth < text.length * fontSize) {
                imageWidth = text.length * fontSize
            }

            imageHeight = imageHeight + fontSize * 1.5
        })
    }

    // 图片
    const baseImage = gm(imageWidth, imageHeight, "#ffffff")
        .transparent("#ffffff")
        .font(path.resolve(__dirname, 'SourceHanSansCN-Normal.ttf'))

    // 文字定位
    let yPosition = 0

    for (const text of textInfos) {
        yPosition = yPosition + text.fontSize * 0.5

        baseImage.stroke(text.color + parseInt(text.transparency / 16).toString(16) + parseInt(text.transparency % 16).toString(16))
            .fontSize(text.fontSize)
            .drawText(0, yPosition - imageHeight / 2, text.text, 'Center')
        yPosition = yPosition + text.fontSize
    }

    return baseImage
        .rotate('#ffffff00', -30)
}

/**
 * 组合水印图片
 * @param {*} textInfos 
 * @param layout 0--居中显示； 1--平铺显示
 * @param textwidth 水印文字中最长的宽度
 */
function mixWaterMark(textInfos, textwidth, layout, req, res) {
    // 缓存路径
    const tempFolder = './tmp/' + Date.now().toString()
    //是否存在当前路径
    if (!fs.existsSync('./tmp')) {
        // 创建路径
        fs.mkdirSync('./tmp');
    }
    if (!fs.existsSync(tempFolder)) {
        // 创建路径
        fs.mkdirSync(tempFolder);
    }

    const { width: screenWidth, height: screenHeight, name } = req.query
    const smallUrl = `${tempFolder}/small.png`
    const backUrl = `${tempFolder}/back.png`
    const outUrl = `${tempFolder}/out.png`

    // 背景图片
    gm(screenWidth, screenHeight, "#ffffff")
        .transparent('#ffffff')
        .write(backUrl, error => {
            if (!error) {
                const smallImage = getSmallWaterImage(textInfos, textwidth)

                smallImage.write(smallUrl, error => {
                    if (!error) {
                        // smallImage，获取大小
                        gm(smallUrl).size((error, { width, height }) => {
                            if (!error) {
                                const outImage = gm(backUrl)

                                if (layout) {
                                    // 平铺显示
                                    // 每个小的水印图片，左右间距50，上下间距80
                                    const newWidth = width + 100
                                    const newHeight = height + 160
                                    // 计算几行几列
                                    const row = Math.ceil(screenHeight / newHeight)
                                    const col = Math.ceil(screenWidth / newWidth)
                                    let xPosition = 25
                                    let yPosition = 40

                                    for (let i = 0; i < row; i++) {
                                        for (let j = 0; j < col; j++) {
                                            xPosition = j * newWidth + 25
                                            yPosition = i * newHeight + 40

                                            outImage.draw([`image over ${xPosition},${yPosition} 0,0 "${smallUrl}"`])
                                        }
                                    }
                                } else {
                                    // 居中显示
                                    const xPosition = (screenWidth - width) / 2
                                    const yPosition = (screenHeight - height) / 2
                                    outImage.draw([`image over ${xPosition},${yPosition} 0,0 "${smallUrl}"`])
                                }

                                outImage.write(outUrl, error => {
                                    if (!error) {
                                        // 读取svg文件
                                        fs.readFile(outUrl, (error, buffer) => {
                                            if (!error) {
                                                res.set({
                                                    'Content-Type': 'application/octet-stream',
                                                    'Cache-Control': 'public',
                                                    'Content-Disposition': `attachment; filename="${req.query.name}.png"; filename*=utf-8''${req.query.name}.png`
                                                })

                                                // 删除
                                                fs.unlinkSync(backUrl)
                                                fs.unlinkSync(smallUrl)
                                                fs.unlinkSync(outUrl)
                                                fs.rmdirSync(tempFolder)

                                                // 发送二进制文件
                                                res.send(buffer)
                                            } else {
                                                fs.unlinkSync(backUrl)
                                                fs.unlinkSync(smallUrl)
                                                fs.unlinkSync(outUrl)
                                                fs.rmdirSync(tempFolder)

                                                res.status(500);
                                                res.send(error);
                                            }
                                        })
                                    } else {
                                        fs.unlinkSync(backUrl)
                                        fs.unlinkSync(smallUrl)
                                        fs.rmdirSync(tempFolder)

                                        res.status(500);
                                        res.send(error);
                                    }
                                })
                            } else {
                                fs.unlinkSync(backUrl)
                                fs.unlinkSync(smallUrl)
                                fs.rmdirSync(tempFolder)

                                res.status(500);
                                res.send(error);
                            }
                        })
                    } else {
                        fs.unlinkSync(backUrl)
                        fs.rmdirSync(tempFolder)

                        res.status(500);
                        res.send(error);
                    }
                })
            }
        })
}

module.exports = waterMark;