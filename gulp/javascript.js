/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:44 AM
 * @Email:  developer@xyfindables.com
 * @Filename: browserify.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:05 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const browserify = require(`browserify`);
const buffer = require(`vinyl-buffer`);
const connect = require(`gulp-connect`);
const source = require(`vinyl-source-stream`);
const sourcemaps = require(`gulp-sourcemaps`);
// const uglify = require(`gulp-uglify`);

let watch = null;

const javascript = () => {
  const b = browserify({
    insertGlobals: true,
    entries: [`./src/js/all.js`],
    debug: true,
  });

  return b.bundle()
    .pipe(source(`all.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`./dist/js`))
    .pipe(connect.reload());
};

gulp.task(`js`, javascript);

gulp.task(`watch-js`, [`js`], () => {
  watch = watch || gulp.watch(`./src/js/**/*.js`, [`js`], connect.reload());
});

module.exports = javascript;
