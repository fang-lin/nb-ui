'use strict';

const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');

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

gulp.task('sprite', function () {
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

