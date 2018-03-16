/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 9:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: sass.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 16, 2018 12:18 PM
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

const SOURCE_BASE = `./src`;
const OUTPUT_BASE = `./dist`;

const getLocation = (base, location) => `${base}${location}`;

const sass = () => {
  const sassOutput = gulp.src(getLocation(SOURCE_BASE, `/css/**/*.scss`))
    .pipe(gulpSass({
      includePaths: [`node_modules/bootstrap-sass/assets/stylesheets/`],
    }).on(`error`, (err) => {
      console.log(err.message);
    }));

  const css =
    gulp.src(getLocation(SOURCE_BASE, `/css/**/*.css`));
  // .pipe(sourcemaps.write('./'));

  return es.merge(sassOutput, css)
    /* would like to get this working .pipe(cssCopyAssets) */
    .pipe(concat(`all.css`))
    .pipe(cleanCSS({
      compatibility: `ie8`,
    }))
    .pipe(gulp.dest(getLocation(OUTPUT_BASE, `/css/`)))
    .pipe(connect.reload());
};

gulp.task(`sass-task`, sass);

gulp.task(`sass`, [`sass-task`], () => {
  gulp.watch(getLocation(SOURCE_BASE, `/css/**/*.*`), [`sass`], connect.reload());
});

module.exports = sass;
