var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var less        = require('gulp-less');
var mincss      = require('gulp-minify-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var del         = require('del');
var livereload  = require('gulp-livereload');

// jshint
gulp.task('jshint', function(){
    gulp.src('./app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// less, css
gulp.task('css', function(){
    gulp.src('./app/css/main.less')
        .pipe(less())
        .pipe(mincss())
        .pipe(gulp.dest('./dist/css/'))
});

// amd
// TODO: minify, source maps
gulp.task('js', function() {
    gulp.src(['./app/js/*/**/*.js', './app/js/main.js'])
        .pipe(uglify())    
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js'));
});

// copy dirs recursively (not app/css or app/js)
var dirs = ['icons', 'img', 'script', 'partials', 'pages'];
gulp.task('copy', function() {
    gulp.src(['./app/*.*'])
    .pipe(gulp.dest('./dist'));
    dirs.forEach(function(dir){
        gulp.src(['./app/' + dir + '/**/*'])
        .pipe(gulp.dest('./dist/' + dir));
    });
});

// TODO: DRY 
gulp.task('watch-app', function(){
    gulp.src('./app/css/main.less')
        .pipe(less())
        .pipe(mincss())
        .pipe(gulp.dest('./app/css/'))
        .pipe(livereload());
    gulp.src('./app/js/**/*.js')
        .pipe(livereload());
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch('./app/css/*.less',  ['watch-app']);
});

// rm the dist dir
gulp.task('clean', function(cb) {
    del(['./dist'], cb);
});

// build
gulp.task('build', function() {
    gulp.start('clean', 'css', 'js', 'copy');
});
