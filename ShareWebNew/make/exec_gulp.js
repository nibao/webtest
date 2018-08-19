const fs = require('fs')
const { exec } = require('child_process')

fs.readdirSync('..').forEach(name => {
    if (fs.statSync(`../${name}`).isDirectory() && fs.readdirSync(`../${name}`).indexOf('gulpfile.js') !== -1) {
        exec(`gulp --gulpfile=../${name}/gulpfile.js`, (error, stdout, stderr) => {
            console.log(stdout)
        })
    }
})