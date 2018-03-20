/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:44 AM
 * @Email:  developer@xyfindables.com
 * @Filename: browserify.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, March 20, 2018 11:05 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const browserify = require(`browserify`);
const buffer = require(`vinyl-buffer`);
const connect = require(`gulp-connect`);
const source = require(`vinyl-source-stream`);
const sourcemaps = require(`gulp-sourcemaps`);
const utils = require(`./utils`);
// const uglify = require(`gulp-uglify`);

let watch = null;
const src = `./src`;
const dest = `./dist`;

const getLocation = (base, location) => `${base}${location}`;

const javascript = () => {
  const b = browserify({
    insertGlobals: true,
    entries: [utils.getLocation(src, `/js/all.js`)],
    debug: true,
  });

  return b.bundle()
    .pipe(source(`all.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(utils.getLocation(dest, `/js`)))
    .pipe(connect.reload());
};

gulp.task(`js`, javascript);

gulp.task(`watch-js`, [`js`], () => {
  watch = watch || gulp.watch(getLocation(src, `/js/**/*.js`), [`js`], connect.reload());
});

module.exports = javascript;
