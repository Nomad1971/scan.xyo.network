/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: serve.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, March 24, 2018 11:57 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const connect = require(`gulp-connect`);
const open = require(`gulp-open`);

let port = 8080;

const browse = () => {
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

browse.config = (_port) => {
  port = _port;
};

gulp.task(`browse`, browse);

module.exports = browse;
