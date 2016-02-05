var gulp        = require('gulp');
// var browserSync = require('browser-sync').create();
var browserSync = require('browser-sync');
var exec        = require('child_process').exec;
// var harp        = require('harp');
var less        = require('gulp-less');
var path        = require('path');
var sass        = require('gulp-sass');
var ejs         = require('gulp-ejs');
var gutil       = require('gulp-util');

// Serve the Harp Site from the public directory
// gulp.task('serve-xxx', function () {
//     harp.server(
//         // projectPath
//         path.join(__dirname, 'public'),
//         // options
//         {
//             port: 9000
//         },
//         // callback
//         function () {
//
//             browserSync({
//                 proxy: "localhost:9000",
//                 open: false,
//                 notify: { // hide the notifications
//                     styles: ['position: absolute','z-index: -9999','opacity: 0']
//                 }
//             });
//
//             gulp.watch(["*.css", "*.sass", "*.scss", "*.less"], function () {
//                 browserSync.reload("main.css", {stream: true});
//             });
//
//             gulp.watch(["*.html", "*.ejs", "*.jade", "*.js", "*.json", "*.md"], function () {
//                 browserSync.reload();
//             });
//
//         } // end callback
//     ) // end server
// });

// Compile Less/Sass into CSS & auto-inject into browsers
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
gulp.task("templates", function() {
    return gulp.src("_harp/**/*.ejs")
    	.pipe(ejs().on("error", gutil.log))
    	.pipe(gulp.dest("public"));
});

gulp.task('build', function (done) {
    exec('harp compile _harp ./public', {stdio: 'inherit'})
    .on('close', done)
});

// Static Server + watching less/sass/html files
gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: "public"
    });

    // gulp.watch("_harp/css/*.sass", ['sass']);
    // gulp.watch("_harp/css/*.less", ['less']);
    // gulp.watch("_harp/**/*.ejs", ['templates']);
    gulp.watch("_harp/**/*.*", ['build']);
    gulp.watch("public/css/*.css").on('change', browserSync.stream);
    gulp.watch("public/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
