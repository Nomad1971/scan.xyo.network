/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:38 AM
 * @Email:  developer@xyfindables.com
 * @Filename: index.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, March 24, 2018 12:03 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint global-require: 0 */

const gulp = require(`gulp`);

const xyo = {
  browse: require(`./browse`),
  clean: require(`./clean`),
  kit: require(`./kit`),
  contracts: require(`./contracts`),
  help: require(`./help`),
  images: require(`./images`),
  invalidate: require(`./invalidate`),
  javascript: require(`./javascript`),
  publish: require(`./publish`),
  sass: require(`./sass`),
  tasks: {},
};

xyo.tasks.default = gulp.task(`default`, [`help`]);

xyo.tasks.watch = gulp.task(`watch`, [`watch-kit`, `watch-sass`, `watch-js`, `images`, `contracts`], (callback) => {
  callback();
});

xyo.tasks.watch = gulp.task(`develop`, [`watch`], (callback) => {
  xyo.browse();
  callback();
});

xyo.tasks.build = gulp.task(`build`, [`kit`, `sass`, `js`, `images`, `fonts`, `contracts`]);

module.exports = xyo;
