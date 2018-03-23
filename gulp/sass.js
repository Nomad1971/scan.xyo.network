/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 9:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: sass.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:20 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const gulp = require(`gulp`);

const cleanCSS = require(`gulp-clean-css`);
const concat = require(`gulp-concat`);
const connect = require(`gulp-connect`);
const es = require(`event-stream`);
const gulpSass = require(`gulp-sass`);

let watch = null;

const sass = () => {
  const sassOutput = gulp.src(`./src/css/**/*.*`)
    .pipe(gulpSass({
      includePaths: [`node_modules/bootstrap-sass/assets/stylesheets/`],
    }).on(`error`, (err) => {
      console.log(err.message);
    }));

  const merge = es.merge(sassOutput, gulp.src(`./src/css/**/*.css`))
    .pipe(concat(`all.css`))
    .pipe(cleanCSS({
      compatibility: `ie8`,
    }))
    .pipe(gulp.dest(`./dist/css`))
    .pipe(connect.reload());

  return merge;
};

gulp.task(`sass`, sass);

gulp.task(`watch-sass`, [`sass`], () => {
  watch = watch || gulp.watch(`./src/css/**/*`, [`sass`], connect.reload());
});

module.exports = sass;
