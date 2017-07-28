var gulp = require('gulp'),
plumber = require('gulp-plumber'),
rename = require('gulp-rename'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
minify_css = require("gulp-minify-css"),
cache = require('gulp-cache'),
sass = require('gulp-sass'),
file_include = require("gulp-file-include"),
browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./public"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('dev/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/assets/images/'));
});

gulp.task('styles', function(){
  gulp.src(['dev/styles/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minify_css({
        compatibility: 'ie8'
    }))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task("bootstrap", function() {
    return gulp.src("dev/styles/" + "bootstrap.scss")
    .pipe(sass())
    .pipe(minify_css({
        compatibility: 'ie8'
    }))
    .pipe(rename('bootstrap.min.css'))
    .pipe(gulp.dest("public/assets/css"));
});

gulp.task('scripts', function(){
  return gulp.src('dev/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('file_include', function() {
  return gulp.src("dev/pages/" + "*.html")
  .pipe(file_include({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest('public/'))
  .pipe(browserSync.reload({stream:true}))
});


gulp.task('default', ['browser-sync','bootstrap'], function(){
  gulp.watch("dev/styles/**/*.scss", ['styles']);
  gulp.watch("dev/js/**/*.js", ['scripts']);
  gulp.watch("dev/pages/" + "*.html", ['file_include']);
  gulp.watch("dev/parts/" + "*.html", ['file_include']);
  gulp.watch("dev/parts/" + "*/*.html", ['file_include']);
  gulp.watch("*.html", ['bs-reload']);
});
