/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 12:21 PM
 * @Email:  developer@xyfindables.com
 * @Filename: publissh.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 12:25 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const gulp = require(`gulp`);

const gulpS3Upload = require(`gulp-s3-upload`)({ useIAM: true });

const publish = () => {
  gulp.src(`./dist/**`)
    .pipe(gulpS3Upload({
      Bucket: `scan.xyo.network`, //  Required
      ACL: `public-read`, //  Needs to be user-defined
    }, {
      // S3 Constructor Options, ie:
      maxRetries: 5,
    }));
};

gulp.task(`publish`, publish);

module.exports = publish;
