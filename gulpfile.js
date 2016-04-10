"use strict";

var gulp = require('gulp')
var mocha = require('gulp-mocha')

gulp.task('test', () => {
    return gulp
            .src('api/test/*.spec.js')
            .pipe(mocha())

})

gulp.task('default', ['test'], function() {

    const tasks = ['test'];

    gulp.watch(['**/*.js', 'api/**/*.spec.js', 'gulpfile.js', 'app.js', 'config.js'], tasks);
});
