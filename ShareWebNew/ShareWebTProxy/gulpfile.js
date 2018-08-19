const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

gulp.task('symlink', () => {
    del.sync([
        path.resolve(__dirname, './gen-node')
    ])

    fs.symlinkSync(path.resolve(__dirname, '../thrift/gen-node'), path.resolve(__dirname, './gen-node'), os.platform() === 'win32' ? 'junction' : 'dir');
});

gulp.task('default', ['symlink'])