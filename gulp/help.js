/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:30 AM
 * @Email:  developer@xyfindables.com
 * @Filename: help.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, March 24, 2018 12:04 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const help = () => {
  console.log(`\r\n`);
  console.log(`\r\n`);
  console.log(`============================== XYO Gulp Help ==============================`);
  console.log(`\r\n`);
  console.log(` browse       Open the project in a browser and watches`);
  console.log(` build        Start a standard build`);
  console.log(` clean        Delete the dist folder`);
  console.log(` contracts    Copy compiled solidity contracts from xyo-solidity to dist`);
  console.log(` develop      watch + browse`);
  console.log(` help         Instructions on how to use XYO's Build System (this output)`);
  console.log(` images       Copy the img folder from src to dist`);
  console.log(` invalidate   Invalidate a cloudfront distribution`);
  console.log(` javascript   Process .js files from src to dist`);
  console.log(` kit          Process .kit files from src to dist`);
  console.log(` publish      Invalidate a cloudfront distribution`);
  console.log(` sass         Process .scss files from src to dist`);
  console.log(` watch        Watch for changes in src files and then processes them`);
  console.log(`\r\n`);
  console.log(`\r\n`);
};

gulp.task(`help`, help);

module.exports = help;
