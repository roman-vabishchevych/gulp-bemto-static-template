const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const del = require('del');
const concat = require('gulp-concat');

var processors = [
	autoprefixer({browsers: ['last 1 version']}),
];

const serve = (done) => {
  browserSync.init({
      server: "./build"
  });
  done();
};

const reload = (done) => {
  browserSync.reload();
  done();
};

const ignorePug = [
	'!src/layouts/**',
	'!src/blocks/**'
];

const jsAppFiles = [
	'src/assets/**/*.js',
	'src/blocks/**/*.js',
];

const jsVendorFiles = 'src/vendor/**/*.js';

const cssAppFiles = [
	'src/assets/**/*.styl',
	'src/blocks/**/*.styl',
];

const cssVendorFiles = 'src/vendor/**/*.css';

gulp.task('html', function(){
  return gulp.src(['src/**/*.pug', ...ignorePug])
    .pipe(pug())
    .pipe(gulp.dest('build'))
});

gulp.task('css', () => {
  return gulp.src(cssAppFiles)
    .pipe(stylus())
    .pipe(postcss(processors))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream())
});

gulp.task('css:vendor', () => {
  return gulp.src(cssVendorFiles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream())
});

gulp.task('js', () => {
  return gulp.src(jsAppFiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/assets'));
});

gulp.task('js:vendor', () => {
  return gulp.src(jsVendorFiles)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/assets'));
});

gulp.task('copy', function() {
  return gulp
    .src([
			'src/assets/**/*.{jpg,png,jpeg,svg,gif}',
			'src/assets/**/*.{ttf,eot,woff,woff2}'
		])
    .pipe(gulp.dest('build/assets'));
});

gulp.task('build', gulp.parallel('html', 'css', 'css:vendor', 'js', 'js:vendor', 'copy'));

gulp.task('clean', () => {
	return del('build');
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.pug', gulp.series('html', reload));
	gulp.watch('src/**/*.js', gulp.series('js', 'js:vendor', reload));
	gulp.watch('src/**/*.styl', gulp.series('css'));
	gulp.watch(cssVendorFiles, gulp.series('css:vendor'));
});

gulp.task('serve', gulp.parallel(serve, 'watch'));

gulp.task('default', gulp.series('clean', 'build', 'serve'));
