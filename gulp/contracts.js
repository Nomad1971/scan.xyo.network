/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 4:25 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const contracts = () => gulp.src(`./node_modules/xyo-solidity/dist/contracts/**`)
  .pipe(gulp.dest(`./dist/contracts`));

gulp.task(`contracts`, contracts);

module.exports = contracts;
