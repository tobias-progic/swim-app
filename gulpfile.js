"use strict";

const gulp = require('gulp')
const mocha = require('gulp-mocha')
const webpack = require('gulp-webpack')
const nodemon = require('gulp-nodemon')

gulp.task('nodemon', function() {
  nodemon({
    script: 'app.js',
    // nodeArgs: ['--harmony']
  }).on('restart');
})

gulp.task('webpack', () => {
    return gulp.src('client/src/app.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('client/dist/'));
});

gulp.task('test', () => {
    return gulp
    .src('api/test/*.spec.js')
    .pipe(mocha())

})

gulp.task('dev', ['webpack'], () => {
    const client = ['webpack']
    gulp.watch(['client/**/*.js', 'client/**/*.jsx'], client)
})

gulp.task('default', ['test', 'webpack', 'nodemon'], () => {
    // const api = ['test']
    // gulp.watch(['**/*.js', 'api/**/*.spec.js', 'gulpfile.js', 'app.js', 'config.js'], api)
})
