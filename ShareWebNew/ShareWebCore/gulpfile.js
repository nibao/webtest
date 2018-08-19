const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const os = require('os');

/**
 * 为依赖库建立软链接
 */
gulp.task('symlink', () => {
    const type = os.platform() === 'win32' ? 'junction' : 'dir'

    del.sync([
        path.resolve(__dirname, './libs'),
        path.resolve(__dirname, './util'),
        path.resolve(__dirname, './ui'),
        path.resolve(__dirname, './gen-js')
    ]);

    fs.symlinkSync(path.resolve(__dirname, '../libs'), path.resolve(__dirname, './libs'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUtil/src'), path.resolve(__dirname, './util'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUI/src'), path.resolve(__dirname, './ui'), type);
    fs.symlinkSync(path.resolve(__dirname, '../thrift/gen-js'), path.resolve(__dirname, './gen-js'), type);
});


gulp.task('default', ['symlink'])