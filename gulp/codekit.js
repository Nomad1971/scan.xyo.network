/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, March 20, 2018 11:15 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
const kit = require(`gulp-kit`);
const utils = require(`./utils`);

let watch = null;
const src = `./src`;
const dest = `./dist`;
const filter = `/**/*.kit`;

const codekit = () => gulp.src(utils.getLocation(src, filter))
  .pipe(kit())
  .on(`error`, (err) => {
    console.log(err.message);
  })
  .pipe(gulp.dest(dest))
  .pipe(connect.reload());

gulp.task(`kit`, codekit);

gulp.task(`watch-kit`, [`kit`], () => {
  watch = watch || gulp.watch(utils.getLocation(src, filter), [`kit`], connect.reload());
});

module.exports = codekit;
