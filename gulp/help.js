/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:30 AM
 * @Email:  developer@xyfindables.com
 * @Filename: help.js
 * @Last modified by:   arietrouw
 * @Last modified time: Thursday, March 29, 2018 12:06 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);
const debug = require(`debug`)(`help`);

const help = () => {
  const message = [];
  message.push(``);
  message.push(``);
  message.push(`============================== XYO Gulp Help ==============================`);
  message.push(``);
  message.push(` atom         Install all standard XY/XYO Atom Packages`);
  message.push(` browse       Open the project in a browser and watches`);
  message.push(` build        Start a standard build`);
  message.push(` clean        Delete the dist folder`);
  message.push(` contracts    Copy compiled solidity contracts from xyo-solidity to dist`);
  message.push(` develop      watch + browse`);
  message.push(` help         Instructions on how to use XYO's Build System (this output)`);
  message.push(` images       Copy the img folder from src to dist`);
  message.push(` invalidate   Invalidate a cloudfront distribution`);
  message.push(` javascript   Process .js files from src to dist`);
  message.push(` kit          Process .kit files from src to dist`);
  message.push(` publish      Invalidate a cloudfront distribution`);
  message.push(` sass         Process .scss files from src to dist`);
  message.push(` watch        Watch for changes in src files and then processes them`);
  message.push(``);
  message.push(``);
  debug(message.join(`\r\n`));
};

gulp.task(`help`, help);

module.exports = help;
