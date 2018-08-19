const multer = require('multer');
const fs = require('fs');
const path = require('path')

const createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

const uploadFolder = path.resolve(__dirname, '../tmp');
createFolder(uploadFolder);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 保存的路径
        const folder = path.resolve(__dirname, uploadFolder, Date.now().toString())
        createFolder(folder)
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // 保存的名字
        cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage })

//导出对象
module.exports = upload;