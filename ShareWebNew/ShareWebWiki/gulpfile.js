const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

/**
 * 为依赖库建立软链接
 */
gulp.task('symlink', () => {
    del.sync([
        path.resolve(__dirname, './util'),
        path.resolve(__dirname, './ui'),
        path.resolve(__dirname, './core'),
        path.resolve(__dirname, './components'),
        path.resolve(__dirname, './console'),
        path.resolve(__dirname, './libs'),
        path.resolve(__dirname, './assets'),
        path.resolve(__dirname, './server.js'),
    ])

    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUtil/src'), path.resolve(__dirname, './util'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUI/src'), path.resolve(__dirname, './ui'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebCore/src'), path.resolve(__dirname, './core'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebComponents/src'), path.resolve(__dirname, './components'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebConsole/src'), path.resolve(__dirname, './console'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../libs'), path.resolve(__dirname, './libs'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../assets'), path.resolve(__dirname, './assets'), 'dir');
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebMockup/dist/server.js'), path.resolve(__dirname, './server.js'));
});

gulp.task('default', ['symlink'])