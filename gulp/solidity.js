/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 16, 2018 8:46 AM
 * @Email:  developer@xyfindables.com
 * @Filename: solidity.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, March 20, 2018 11:05 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
// const debug = require(`gulp-debug-streams`);

const utils = require(`./utils`);

const MODULE_BASE = `./node_modules`;

let watch = null;
const dest = `./dist`;
const filter = `/xyo-solidity/dist/**/*.json`;

const solidity = () =>
  gulp.src([
    utils.getLocation(MODULE_BASE, filter),
  ], {
    base: `${MODULE_BASE}/xyo-solidity/dist/`,
  })
    .pipe(gulp.dest(utils.getLocation(dest, filter)));
gulp.task(`solidity`, solidity);

gulp.task(`watch-solidity`, [`solidity`], () => {
  watch = watch || gulp.watch(utils.getLocation(MODULE_BASE, filter), [`solidity`], connect.reload());
});

module.exports = solidity;
