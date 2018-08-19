const { execSync } = require('child_process');
const process = require('process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const [, , APIRoot] = process.argv;

process.chdir(APIRoot)

const thriftFiles = fs.readdirSync(APIRoot).filter(f => path.extname(f) === '.thrift')

const outDir = path.resolve(__dirname, '../thrift/gen-node');

if (!fs.existsSync(outDir)) {
    execSync(`mkdir -p ${outDir}`)
}

for (const thriftAPI of thriftFiles) {
    try {
        const thriftBin = os.platform() === 'linux' ? path.resolve(__dirname, 'thrift') : path.resolve(__dirname, 'thrift.exe')

        fs.chmodSync(`${thriftBin}`, 0777)
        execSync(`${thriftBin} -r --gen js:node -out ${outDir} ${thriftAPI}`)
    } catch (ex) {
        console.error(ex)
    }
}