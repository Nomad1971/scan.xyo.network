/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 16, 2018 8:46 AM
 * @Email:  developer@xyfindables.com
 * @Filename: solidity.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 16, 2018 8:52 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
// const debug = require(`gulp-debug-streams`);

const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;

const MODULE_BASE = `./node_modules`;

const getLocation = (base, location) => `${base}${location}`;

const solidity = () => gulp.src([
  getLocation(MODULE_BASE, `/xyo-solidity/dist/**/*.json`),
], {
  base: `${MODULE_BASE}/xyo-solidity/dist/`,
})
  // .pipe(debug())
  .pipe(gulp.dest(OUTPUT_BASE));
  // .pipe(debug());

gulp.task(`solidity-task`, solidity);

gulp.task(`solidity`, [`solidity-task`], () => {
  gulp.watch(getLocation(SOURCE_BASE, `/css/**/*.*`), [`solidity`], connect.reload());
});

module.exports = solidity;
