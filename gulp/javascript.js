/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:44 AM
 * @Email:  developer@xyfindables.com
 * @Filename: browserify.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, March 19, 2018 11:07 AM
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

const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;

let watch = null;

const getLocation = (base, location) => `${base}${location}`;

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
    .pipe(gulp.dest(getLocation(OUTPUT_BASE, `/js`)))
    .pipe(connect.reload());
};

gulp.task(`js-task`, javascript);

gulp.task(`js`, [`js-task`], () => {
  watch = watch || gulp.watch(getLocation(SOURCE_BASE, `/js/**/*.js`), [`js`], connect.reload());
});

module.exports = javascript;
