/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 11:49 AM
 * @Email:  developer@xyfindables.com
 * @Filename: clean.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 11:58 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);
const del = require(`del`);

const clean = () => {
  del(`./dist`);
};

gulp.task(`clean`, clean);

module.exports = clean;
