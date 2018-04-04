/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, April 3, 2018 4:28 PM
 * @Email:  developer@xyfindables.com
 * @Filename: fonts.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, April 3, 2018 4:31 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const fonts = () => gulp.src(`node_modules/font-awesome/fonts/*`)
  .pipe(gulp.dest(`dist/fonts`));

gulp.task(`fonts`, fonts);

module.exports = fonts;
