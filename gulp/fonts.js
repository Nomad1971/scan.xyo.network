/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 12:27 PM
 * @Email:  developer@xyfindables.com
 * @Filename: fonts.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:28 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const fonts = () => gulp.src(`./src/fonts/**/*`)
  .pipe(gulp.dest(`./dist`));

gulp.task(`fonts`, fonts);

module.exports = fonts;
