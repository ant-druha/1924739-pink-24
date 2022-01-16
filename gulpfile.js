import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import del from 'del';
import csso from 'postcss-csso';
import terser from 'gulp-terser';
import squoosh from 'gulp-squoosh';
import rename from 'gulp-rename';
import svgStore from 'gulp-svgstore';
import svgo from 'gulp-svgo';
import htmlMin from 'gulp-htmlmin';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', {sourcemaps: true})
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      postcssImport(),
      postcssUrl({
        assetsPath: '../'
      }),
      autoprefixer(),
      csso(),
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {sourcemaps: '.'}))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'))
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images

const imagesOptimize = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      encodeOptions: {
        mozjpeg: {},
        webp: {},
        oxipng: {}
      }
    }))
    .pipe(gulp.dest('build/img'));
}

const imagesWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      encodeOptions: {
        webp: {}
      }
    }))
    .pipe(gulp.dest('build/img'));
}

const imagesCopy = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
}

// SVG

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg'
    , {
      base: 'source'
    })
    .pipe(svgo())
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

const copy = () => {
  return gulp.src(['source/fonts/*.{woff2,woff}',
      'source/*.ico',
      'source/manifest.webmanifest']
    , {
      base: 'source'
    })
    .pipe(gulp.dest('build/'));
}

// Clean

const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  svg,
  imagesOptimize,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite
  ),
)


export default gulp.series(
  clean,
  copy,
  svg,
  imagesCopy,
  imagesWebp,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite
  ),
  gulp.series(
    server, watcher
  )
);
