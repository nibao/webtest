const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

/**
 * 为依赖库建立软链接
 */
gulp.task('symlink', () => {
    const type = os.platform() === 'win32' ? 'junction' : 'dir'

    del.sync([
        path.resolve(__dirname, './util'),
        path.resolve(__dirname, './ui'),
        path.resolve(__dirname, './core'),
        path.resolve(__dirname, './components'),
        path.resolve(__dirname, './libs'),
        path.resolve(__dirname, './assets')
    ])

    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUtil/src'), path.resolve(__dirname, './util'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUI/src'), path.resolve(__dirname, './ui'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebCore/src'), path.resolve(__dirname, './core'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebComponents/src'), path.resolve(__dirname, './components'), type);
    fs.symlinkSync(path.resolve(__dirname, '../libs'), path.resolve(__dirname, './libs'), type);
    fs.symlinkSync(path.resolve(__dirname, '../assets'), path.resolve(__dirname, './assets'), type);
});

gulp.task('default', ['symlink'])