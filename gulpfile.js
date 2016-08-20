'use strict';

const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const fs = require('fs');
const path = require('path');

gulp.task('serve', function () {
    return nodemon({
        script: 'app/server.js',
        ext: 'js ejs',
        env: {'NODE_ENV': 'development'}
    });
});

gulp.task('sass', ['sprite'], function () {
    return gulp.src('app/scss/main.scss')
        .pipe(sass({
            includePaths: [
                require('bourbon').includePaths
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('./app/style'));
});

gulp.task('watch-sass', function () {
    return gulp.watch('app/scss/**', ['sass']);
});

gulp.task('watch-sprite', function () {
    return gulp.watch('app/watch-slices/**', ['sprite']);
});

gulp.task('check-slices', function (done) {
    let slices = {
        files: {},
        keys: []
    };

    const defaultSuffix = '@x1';

    function readSlices(slicesOpt, ext) {
        slicesOpt.map((opt) => {
            fs.readdir(opt.path, (err, files) => {
                if (err) {
                    done(err);
                } else {
                    checkSlices(files.filter(f => f.match(ext)), opt.suffix, slicesOpt.length, ext, defaultSuffix);
                }
            });
        });
    }

    function checkSlices(files, suffix, max, ext, originalKey) {
        const key = suffix ? suffix : originalKey;
        slices.files[key] = files.map(f => path.basename(f, ext));
        slices.keys.push(key);

        if (slices.keys.length === max) {
            let mismatches = [];
            const slices1x = slices.files[originalKey];
            slices.keys.forEach((suffix) => {
                if (suffix !== originalKey) {
                    mismatches = mismatches.concat(slices.files[suffix].filter((f) => {
                        return slices1x.indexOf(f.replace(suffix, '')) < 0;
                    }));
                }
            });
            if (mismatches.length > 0) {
                done(`Not found original image of "${mismatches.join(', ')}"`);
            } else {
                done();
            }
        }
    }

    readSlices([{
        path: './app/slices/1x',
        suffix: defaultSuffix
    }, {
        path: './app/slices/3x',
        suffix: '@3x'
    }], '.png');
});

gulp.task('sprite', ['check-slices'], function () {
    return merge(
        gulp.src('app/slices/3x/*.png').pipe(spritesmith({
            imgName: 'images/sprite@3x.png',
            cssName: 'scss/sprite@3x.scss',
            algorithm: 'binary-tree'
        })).pipe(gulp.dest('./app/')),
        gulp.src('app/slices/1x/*.png').pipe(spritesmith({
            imgName: 'images/sprite@1x.png',
            cssName: 'scss/sprite.scss',
            algorithm: 'binary-tree'
        })).pipe(gulp.dest('./app/'))
    );
});

gulp.task('default', ['serve', 'sass', 'watch-sass', 'watch-sprite']);
gulp.task('build', ['sass', 'watch-sprite']);

