/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Wednesday, March 14, 2018 9:06 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
const htmlmin = require(`gulp-htmlmin`);
const kit = require(`gulp-kit`);

const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;

const getLocation = (base, location) => `${base}${location}`;

const codekit = () => gulp.src(getLocation(SOURCE_BASE, `/**/*.kit`))
  .pipe(kit().on(`error`, (err) => {
    console.log(err.message);
  }))
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest(OUTPUT_BASE))
  .pipe(connect.reload());

gulp.task(`kit`, codekit);
gulp.watch(getLocation(SOURCE_BASE, `/**/*.kit`), [`kit`], connect.reload());

module.exports = codekit;
