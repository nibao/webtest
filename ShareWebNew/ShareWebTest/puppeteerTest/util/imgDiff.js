const fs = require('fs')
const path = require('path')
const compareImages = require('resemblejs/compareImages')

/**
 * 给定图片文件目录和文件名，与指定基准目录（默认baseline）同名图片文件进行对比，保存结果到图片文件目录
 * @param {string} compareDir 待比较图片目录
 * @param {string} filename 待比较图片文件名
 * @param {string} baseDir 基准目录
 * @param {string} diffDir 对比结果保存目录
 * @param {object} options 图像对比选项
 * @returns {object} 返回Resemble图像对比结果object
 * @example
 * 
 * const compareDir = path.resolve(__dirname,'screenshot')
 * getDiff(compareDir,'test.png')
 * // => object
 */
async function getDiff(compareDir, filename, baseDir = 'baseline', diffDir = 'diff', options) {

    // 默认参数，可以使用options参数覆盖
    // options选项参考文档https://github.com/HuddleEng/Resemble.js
    const defaultOptions = {

    };
    const comparefilePath = path.resolve(compareDir, filename)
    const baselinefilePath = path.resolve(compareDir, '../..', baseDir, filename)
    const diffDirPath = path.resolve(compareDir, diffDir);

    if (!fs.existsSync(comparefilePath)) {
        throw new Error(`对比图像 ${comparefilePath} 不存在，请检查路径是否正确`);
    }

    if (!fs.existsSync(baselinefilePath)) {
        throw new Error(`基准图像 ${baselinefilePath} 不存在，请放置基准图像到对应的目录下`);
    }

    const comparefile = fs.readFileSync(comparefilePath)
    const basefile = fs.readFileSync(baselinefilePath)


    const diffData = await compareImages(comparefile, basefile)

    if (!fs.existsSync(diffDirPath)) fs.mkdirSync(diffDirPath)
    fs.writeFileSync(path.resolve(compareDir, diffDir, filename), diffData.getBuffer())
    return diffData
}

exports = module.exports = {
    getDiff
}