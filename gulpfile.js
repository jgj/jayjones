var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    vendor = "./node_modules/";

var node_modules = ['humane-js/humane.js',].map(function(i) { return vendor + i; });

var paths = {
    "less": ['./src/less/style.less'],
    "js": ['./src/js/*.js'],
    "libs": ['./src/js/lib/promise.js', './src/js/lib/former.js'].concat(node_modules),
    "fonts": [vendor + "/font-awesome/fonts/*"]
};

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('less', function() {
    return gulp.src(paths.less)
        .pipe(less({
            paths: [vendor + 'font-awesome/less']
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('libs', function() {
    return gulp.src(paths.libs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('dist', function() {
    gulp.src(paths.js)
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('./public/js/'));

    gulp.src(paths.libs)
        .pipe(uglify())
        .pipe(rename('libs.min.js'))
        .pipe(gulp.dest('./public/js/'));

    gulp.src(paths.less)
        .pipe(less({
            paths: [vendor + 'font-awesome/less'],
            compress: true
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.libs, ['libs']);
});

gulp.task('deploy', ['dist']);

gulp.task('default', ['fonts', 'less', 'libs', 'js', 'watch']);
