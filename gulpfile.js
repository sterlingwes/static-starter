const gulp = require('gulp');
const { rollup } = require('rollup');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './public'
  });
});

gulp.task('styles', () => {
  return gulp.src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public'))
    .pipe(reload({stream: true}));
});

let cache;
gulp.task('scripts', () => {
  const jsConfig = require('./rollup.config');
  Object.assign(jsConfig, { cache });
  return rollup(jsConfig)
    .then(bundle => {
      cache = bundle;
      return bundle.write(jsConfig);
    })
    .then(() => reload());
});

gulp.task('site', () => {
  return gulp.src('./dev/index.html')
    .pipe(gulp.dest('./public'))
    .pipe(reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('./dev/styles/**/*.scss', ['styles']);
  gulp.watch('./dev/scripts/**/*.js', ['scripts']);
  gulp.watch('./dev/index.html', ['site']);
});

gulp.task('default', ['styles', 'scripts', 'browser-sync', 'site', 'watch']);