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
        path.resolve(__dirname, './libs'),
        path.resolve(__dirname, './util'),
    ])

    fs.symlinkSync(path.resolve(__dirname, '../libs'), path.resolve(__dirname, './libs'), type);
    fs.symlinkSync(path.resolve(__dirname, '../ShareWebUtil/src'), path.resolve(__dirname, './util'), type);
});

gulp.task('default', ['symlink'])
