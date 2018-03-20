/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 9:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: sass.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, March 20, 2018 11:05 AM
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
const utils = require(`./utils`);

let watch = null;
const src = `./src`;
const dest = `./dist`;
const filter = `/css/**/*.*`;

const sass = () => {
  const sassOutput = gulp.src(utils.getLocation(src, filter))
    .pipe(gulpSass({
      includePaths: [`node_modules/bootstrap-sass/assets/stylesheets/`],
    }).on(`error`, (err) => {
      console.log(err.message);
    }));

  const css =
    gulp.src(utils.getLocation(src, `/css/**/*.css`));
  // .pipe(sourcemaps.write('./'));

  const merge = es.merge(sassOutput, css)
    /* would like to get this working .pipe(cssCopyAssets) */
    .pipe(concat(`all.css`))
    .pipe(cleanCSS({
      compatibility: `ie8`,
    }))
    .pipe(gulp.dest(utils.getLocation(dest, filter)))
    .pipe(connect.reload());

  return merge;
};

gulp.task(`sass`, sass);

gulp.task(`watch-sass`, [`sass`], () => {
  watch = watch || gulp.watch(utils.getLocation(src, filter), [`sass`], connect.reload());
});

module.exports = sass;
