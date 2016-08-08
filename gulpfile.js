'use strict';

const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

gulp.task('serve', function () {
    return nodemon({
        script: './app/server.js',
        ext: 'js ejs',
        env: {'NODE_ENV': 'development'}
    });
});

gulp.task('sass', function () {

    return gulp.src('./app/sass/main.scss')
        .pipe(sass({
            includePaths: [
                require('bourbon').includePaths
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('./app/style'));
});

gulp.task('watch-sass', function () {
    return gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['serve', 'sass', 'watch-sass']);

