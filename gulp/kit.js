/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:12 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
const kit = require(`gulp-kit`);

let watch = null;

const codekit = () => gulp.src(`./src/**/*.kit`)
  .pipe(kit())
  .on(`error`, (err) => {
    console.log(err.message);
  })
  .pipe(gulp.dest(`./dist`))
  .pipe(connect.reload());

gulp.task(`kit`, codekit);

gulp.task(`watch-kit`, [`kit`], () => {
  watch = watch || gulp.watch(`./src/**/*.kit`, [`kit`], connect.reload());
});

module.exports = codekit;
