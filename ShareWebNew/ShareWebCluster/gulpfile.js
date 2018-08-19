const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

gulp.task('symlink', () => {

    const type = os.platform() === 'win32' ? 'junction' : 'dir'

    del.sync([
        path.resolve(__dirname, './util'),
        path.resolve(__dirname, './ui'),
        path.resolve(__dirname, './core'),
        path.resolve(__dirname, './console'),
        path.resolve(__dirname, './libs'),
        path.resolve(__dirname, './assets'),
        path.resolve(__dirname, './components'),
        path.resolve(__dirname, './server.js'),
        path.resolve(__dirname, './gen-node'),
        path.resolve(__dirname, './gen-js'),
    ])

    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUtil/src'), path.resolve(__dirname, './util'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUI/src'), path.resolve(__dirname, './ui'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebCore/src'), path.resolve(__dirname, './core'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebConsole/src'), path.resolve(__dirname, './console'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebComponents/src'), path.resolve(__dirname, './components'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebMockup/dist/server.js'), path.resolve(__dirname, './server.js'));
    fs.symlinkSync(path.resolve(__dirname, '../libs'), path.resolve(__dirname, './libs'), type);
    fs.symlinkSync(path.resolve(__dirname, '../assets'), path.resolve(__dirname, './assets'), type);
    fs.symlinkSync(path.resolve(__dirname, '../thrift/gen-node'), path.resolve(__dirname, './gen-node'), type);
    fs.symlinkSync(path.resolve(__dirname, '../thrift/gen-js'), path.resolve(__dirname, './gen-js'), type);
});

gulp.task('default', ['symlink'])