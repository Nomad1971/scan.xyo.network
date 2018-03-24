/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: serve.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, March 24, 2018 11:18 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
const open = require(`gulp-open`);

let port = 8080;

const serve = () => {
  connect.server({
    livereload: true,
    root: `./dist`,
    port,
  });
  gulp.src(__dirname)
    .pipe(open({
      app: `google chrome`,
      uri: `http://localhost:${port}`,
    }));
};

serve.config = (_port) => {
  port = _port;
};

gulp.task(`serve`, serve);

module.exports = serve;
