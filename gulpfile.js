/* jslint node: true */
/* jshint strict: false */

// ############################################################################################################

// ### DTECTR PROJECT ###

// ############################################################################################################

console.time('Loading plugins and configs');

// ### PACKAGES ###
// ---------------------------------------
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var ghpages     = require('gulp-gh-pages');
var exec        = require('child_process').exec;
var gutil       = require('gulp-util');
// var harp        = require('harp');
var less        = require('gulp-less');
var path        = require('path');
var sass        = require('gulp-sass');
var sequence    = require('run-sequence');
var watch       = require('gulp-watch');

// debugging tools
// var filelog       = require('gulp-filelog'); // use: .pipe(filelog())
// var using         = require('gulp-using');   // use: .pipe(using({ prefix:'Using', color:'blue' }))
// var debug         = require('gulp-debug');   // use: .pipe(debug())
// var tap           = require('gulp-tap');     // use: .pipe(tap(function(file,t) { console.log(''lorem'); }))

// ### CONFIGURATIONS ###
// ---------------------------------------
// var _folder_source   = '_harp/';
// var _folder_public   = 'public/';

console.timeEnd('Loading plugins and configs');

// ############################################################################################################

// ### CSS FILES ###
// ---------------------------------------
gulp.task("less", function () {
  return gulp.src("_harp/css/style.less")
    .pipe(less())
    .pipe(gulp.dest("public/css"))
    .pipe(browserSync.stream());
});
gulp.task("sass", function() {
    return gulp.src("_harp/css/style.sass")
        .pipe(sass())
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.stream());
});

// ### TEMPLATE FILES ###
// ---------------------------------------
// gulp.task("templates", function() {
//     return gulp.src("_harp/**/*.ejs")
//     	.pipe(ejs().on("error", gutil.log))
//     	.pipe(gulp.dest("public"));
// });

// ### BUILD THE WEBSITE (via harp) ###
// ---------------------------------------
gulp.task('build', function (done) {
    exec('harp compile _harp ./public', {stdio: 'inherit'})
    .on('close', done);
});

// ### WATCH FILES ###
// ---------------------------------------
gulp.task('watch', function (cb) {
    // NOTICE: this is the (faster) 'gulp-watch'
    // gulp.watch("_harp/css/*.sass", ['sass']);
    // gulp.watch("_harp/css/*.less", ['less']);
    // gulp.watch("_harp/**/*.ejs", ['templates']);
    gulp.watch("_harp/**/*.*", ['build']);
    gulp.watch("public/css/*.css").on('change', browserSync.stream);
    gulp.watch("public/*.html").on('change', browserSync.reload);
});

// ### LOCAL SERVER ###
// ---------------------------------------
gulp.task('serve', function() {
    browserSync.init({
        server: "public"
    });
});

 // ### PUBLISH (to gh-pages) ###
 // ---------------------------------------
gulp.task('publish', function () {
  return gulp.src("./public/**/*")
    .pipe(ghpages())
});


// ############################################################################################################

// use the option "--verbose" to have a more extended logging

// The default task = used for development
gulp.task('default', function () {
    return sequence(
        'build','serve','watch'
    );
});

// The deploy task = used to build and publish the pages
gulp.task('deploy', function () {
    return sequence(
        'build','publish'
    );
});
