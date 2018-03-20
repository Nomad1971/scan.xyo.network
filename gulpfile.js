/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, March 20, 2018 10:32 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const cloudfront = require(`gulp-cloudfront-invalidate`);

const connect = require(`gulp-connect`);

const gulp = require(`gulp`);
const gulpS3Upload = require(`gulp-s3-upload`)({ useIAM: true });
const open = require(`gulp-open`);

require(`./gulp/codekit.js`);
require(`./gulp/javascript.js`);
require(`./gulp/sass.js`);
require(`./gulp/solidity.js`);

const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;

const PORT = 8080;

const getLocation = (base, location) => `${base}${location}`;

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

gulp.task(`default`, [`develop`]);
gulp.task(`develop`, [`watch-kit`, `watch-sass`, `watch-js`, `watch-solidity`, `assets`], (callback) => {
  console.log(`Hello`);
  serve();
  reloadPage();
  callback();
});

gulp.task(`cs`, [`solidity`]);

gulp.task(`release`, [`kit`, `sass`, `js`, `solidity`, `assets`]);
gulp.task(`assets`, [`images`, `fonts`, `data`]);
gulp.task(`serve`, serve);
gulp.task(`images`, processImages);
gulp.task(`fonts`, processFonts);
gulp.task(`data`, processData);
gulp.task(`publish`, publish);
gulp.task(`invalidate`, invalidate);
