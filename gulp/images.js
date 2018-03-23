/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:21 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
let watch = null;

const images = () => gulp.src(`./src/img/**`)
  .pipe(gulp.dest(`./dist/img`))
  .pipe(connect.reload());

gulp.task(`images`, images);

gulp.task(`watch-images`, [`images`], () => {
  watch = watch || gulp.watch(`./src/img/**/*`, [`images`], connect.reload());
});

module.exports = images;
