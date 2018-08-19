const puppeteer = require('puppeteer')
const child_process = require('child_process')
const {
    expect
} = require('chai')
const chalk = require('chalk')
const browserPromise = require('./browserPromise')
const {Cleardb} = require('./util/cleardb')

let borwser
before(async () => {
    console.log(chalk.green('Start of Initialize the database'))

    const connection = new Cleardb().connect('anyshare') // 连接数据库

    /* 可以在这里进行清理数据库操作 */
    
    console.log(chalk.green('End of Initialize the database'))

    browser = await browserPromise()
    console.log(chalk.green(`Start of test in ${await browser.version()}`))
})

after(() => {
    console.log(chalk.green('End of test'))
    browser.close()
})