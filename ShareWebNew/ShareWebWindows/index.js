const path = require('path')
const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const winston = require('winston')
const rfs = require('rotating-file-stream')
const bodyParser = require('body-parser')
const cors = require('cors')
const vendor = require('./scripts/vendor')
const bootstrap = require('./scripts/main')

const service = express()

try {
    // 切割Winston日志
    require('winston-daily-rotate-file')

    // 记录HTTP日志并按固定周期切割
    const logDir = path.join(__dirname, 'log')

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir)
    }

    const logger = new winston.Logger({
        transports: [
            // 记录程序中的警告信息
            new winston.transports.DailyRotateFile({
                level: 'error',
                dirname: logDir,
                filename: 'error.log',
                datePattern: 'YYYY-MM-DD',
                maxFiles: '7d',
            }),
            // 记录程序中的未捕获异常
            new winston.transports.File({
                dirname: logDir,
                filename: 'exception.log',
                handleExceptions: true,
                humanReadableUnhandledException: true,
            })
        ],
        exitOnError: false,
    })

    // 记录HTTP请求
    service.use(morgan((tokens, req, res) => ([
        `[${tokens.date(req, res)}]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res),
        'ms'
    ].join(' ')), {
            stream: rfs('access.log', {
                interval: '1d',
                path: logDir
            })
        }
    ))
} catch (ex) {
    // 无权限创建日志文件时，防止程序崩溃
}

//bodyPareser默认大小限制为100kb，增加bodyPareser的大小限制，fixed error:413 错误：request entity too large 
service.use(bodyParser.json({ limit: '50mb' }))
service.use(express.static('./'))
service.options('*', cors())

bootstrap.default(service, document.querySelector('#root')).then(() => {
    service.listen(10080)
})