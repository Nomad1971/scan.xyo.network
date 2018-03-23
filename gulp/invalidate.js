/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 12:25 PM
 * @Email:  developer@xyfindables.com
 * @Filename: invalidate.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:26 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const cloudfront = require(`gulp-cloudfront-invalidate`);

const invalidate = () => {
  gulp.src(`./dist/**`)
    .pipe(cloudfront({
      distribution: `E1R9VYUMORC8EH`,
      paths: [`/*`],
      wait: false,
    }));
};

gulp.task(`invalidate`, invalidate);

module.exports = invalidate;
