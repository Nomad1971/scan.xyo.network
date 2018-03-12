/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 9:19 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const browserify = require(`browserify`);
const buffer = require(`vinyl-buffer`);
const cleanCSS = require(`gulp-clean-css`);
const cloudfront = require(`gulp-cloudfront-invalidate`);
const concat = require(`gulp-concat`);
const connect = require(`gulp-connect`);
const es = require(`event-stream`);
const gulp = require(`gulp`);
const gulpS3Upload = require(`gulp-s3-upload`)({ useIAM: true });
const htmlmin = require(`gulp-htmlmin`);
const kit = require(`gulp-kit`);
const open = require(`gulp-open`);
const purify = require(`gulp-purify-css`);
const sass = require(`gulp-sass`);
const source = require(`vinyl-source-stream`);
const sourcemaps = require(`gulp-sourcemaps`);
const uglify = require(`gulp-uglify`);


const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;
const MODULE_BASE = `./node_modules`;

const PORT = 8080;

const getLocation = (base, location) => `${base}${location}`;

const compileSCSS = () => {
  const scss = gulp.src(getLocation(SOURCE_BASE, `/css/**/*.scss`))
    .pipe(sass({
      includePaths: [
        `./node_modules/`,
      ],
    }).on(`error`, (err) => {
      console.log(err.message);
    }));

  const css =
    gulp.src(getLocation(SOURCE_BASE, `/css/**/*.css`));
  // .pipe(sourcemaps.write('./'));

  return es.merge(scss, css)
    /* would like to get this working .pipe(cssCopyAssets) */
    .pipe(concat(`all.css`))
    .pipe(cleanCSS({
      compatibility: `ie8`,
    }))
    .pipe(gulp.dest(getLocation(OUTPUT_BASE, `/css/`)))
    .pipe(connect.reload());
};

const serve = () => {
  connect.server({
    livereload: true,
    root: OUTPUT_BASE,
    port: PORT,
  });
  gulp.src(__dirname)
    .pipe(open({
      app: `google chrome`,
      uri: `http://localhost:${PORT}`,
    }));
};

const compileKit = () => gulp.src(getLocation(SOURCE_BASE, `/**/*.kit`))
  .pipe(kit().on(`error`, (err) => {
    console.log(err.message);
  }))
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

const javascript = () => {
  const b = browserify({
    insertGlobals: true,
    entries: [getLocation(SOURCE_BASE, `/js/all.js`)],
    debug: true,
  });

  return b.bundle()
    .pipe(source(`all.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(getLocation(OUTPUT_BASE, `/js`)));

  // .pipe(sourcemaps.init({ loadMaps: true }))
  // Add transformation tasks to the pipeline here.
  // .pipe(uglify())
  //
  // .pipe(sourcemaps.write())
  // .pipe(gulp.dest(getLocation(OUTPUT_BASE, `/js/*.js`)));
};

const purifyCSS = () => gulp.src(getLocation(OUTPUT_BASE, `/css/all.css`))
  .pipe(purify([
    getLocation(OUTPUT_BASE, `/**/*.html`),
    getLocation(OUTPUT_BASE, `/**/*.js`),
  ]))
  .pipe(connect.reload());

const processImages = () => gulp.src([
  getLocation(SOURCE_BASE, `/img/**/*`),
  getLocation(SOURCE_BASE, `/css/**/*.gif`),
  getLocation(SOURCE_BASE, `/**/*.ico`),
], {
  base: SOURCE_BASE,
})
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

const processFonts = () => gulp.src([
  getLocation(SOURCE_BASE, `/fonts/**/*`),
], {
  base: SOURCE_BASE,
})
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

const processData = () => gulp.src([
  getLocation(SOURCE_BASE, `/**/*.json`),
  getLocation(SOURCE_BASE, `/**/*.xml`),
], {
  base: SOURCE_BASE,
})
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

const processSolidity = () => gulp.src([
  getLocation(MODULE_BASE, `/**/dist/**/*.json`),
], {
  base: `${MODULE_BASE}/**/dist/`,
})
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

const publish = () => {
  gulp.src(`./dist/**`)
    .pipe(gulpS3Upload({
      Bucket: `scan.xyo.network`, //  Required
      ACL: `public-read`, //  Needs to be user-defined
    }, {
      // S3 Constructor Options, ie:
      maxRetries: 5,
    }));
};

const invalidate = () => {
  gulp.src(`./dist/**`)
    .pipe(cloudfront({
      distribution: `E1R9VYUMORC8EH`,
      paths: [`/*`],
      wait: false,
    }));
};

const reloadPage = (event) => {
  console.log(`>>>>>>> Reload Page <<<<<<<`);
  console.log(event);
  connect.reload();
};

const watch = () => {
  gulp.watch(getLocation(SOURCE_BASE, `/css/**/*.*`), [`sass`, `purify`], reloadPage);
  gulp.watch(getLocation(SOURCE_BASE, `/js/**/*.*`), [`js`], reloadPage);
  gulp.watch(getLocation(SOURCE_BASE, `/**/*.kit`), [`kit`], reloadPage);
};

gulp.task(`default`, [`develop`]);
gulp.task(`develop`, [`kit`, `sass`, `js`, `assets`, `watch`, `solidity`], (callback) => {
  console.log(`Hello`);
  purifyCSS();
  serve();
  reloadPage();
  callback();
});
gulp.task(`release`, [`kit`, `sass`, `js`, `purify`, `assets`]);
gulp.task(`assets`, [`images`, `fonts`, `data`]);
gulp.task(`watch`, () => {
  watch();
});
gulp.task(`serve`, serve);
gulp.task(`sass`, compileSCSS);
gulp.task(`purify`, purifyCSS);
gulp.task(`js`, javascript);
gulp.task(`kit`, compileKit);
gulp.task(`images`, processImages);
gulp.task(`fonts`, processFonts);
gulp.task(`data`, processData);
gulp.task(`solidity`, processSolidity);
gulp.task(`publish`, publish);
gulp.task(`invalidate`, invalidate);
