/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:30 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

const connect = require(`gulp-connect`);

const gulp = require(`gulp`);
const open = require(`gulp-open`);

require(`./gulp/clean.js`);
require(`./gulp/codekit.js`);
require(`./gulp/fonts.js`);
require(`./gulp/images.js`);
require(`./gulp/invalidate.js`);
require(`./gulp/javascript.js`);
require(`./gulp/publish.js`);
require(`./gulp/sass.js`);

const PORT = 8081;

const serve = () => {
  connect.server({
    livereload: true,
    root: `./dist`,
    port: PORT,
  });
  gulp.src(__dirname)
    .pipe(open({
      app: `google chrome`,
      uri: `http://localhost:${PORT}`,
    }));
};

const reloadPage = (event) => {
  console.log(`>>>>>>> Reload Page <<<<<<<`);
  console.log(event);
  connect.reload();
};

gulp.task(`default`, [`develop`]);
gulp.task(`develop`, [`watch-kit`, `watch-sass`, `watch-js`, `images`, `fonts`], (callback) => {
  console.log(`Hello`);
  serve();
  reloadPage();
  callback();
});

gulp.task(`release`, [`kit`, `sass`, `js`, `images`, `fonts`]);
gulp.task(`serve`, serve);
