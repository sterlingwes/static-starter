const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const source = require('vinyl-source-stream');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './public',
    open: false
  })
});

gulp.task('styles', () => {
  return gulp.src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public'))
    .pipe(reload({stream: true}));
});

let cache
const transpiler = babel({
  presets: [
    [
      "es2015", {
        "modules": false
      }
    ]
  ],
  babelrc: false,
  exclude: 'node_modules/**'
})

gulp.task('scripts', () => {
  return rollup({
    entry: './dev/scripts/main.js',
    plugins: [transpiler],
    cache
  })
    .on('bundle', bundle => { cache = bundle })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public'))
    .pipe(reload({stream: true}));
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