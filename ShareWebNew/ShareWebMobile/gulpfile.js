const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

/**
 * 为依赖库建立软链接
 */
gulp.task('symlink', () => {
    [
        ['../assets', './assets'],
        ['../libs', './libs'],
        ['../ShareWebComponents/src', './components'],
        ['../ShareWebCore/src', './core'],
        ['../ShareWebUI/src', './ui'],
        ['../ShareWebUtil/src', './util']
    ].map(([src, dest]) => {
        del.sync(path.resolve(__dirname, dest))
        fs.symlinkSync(path.resolve(__dirname, src), path.resolve(__dirname, dest), os.platform() === 'win32' ? 'junction' : 'dir');
    })
});

gulp.task('default', ['symlink'])