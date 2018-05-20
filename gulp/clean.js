/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 11:49 AM
 * @Email:  developer@xyfindables.com
 * @Filename: clean.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import rm from 'gulp-rm'

import Base from './base'

class Delete extends Base {
  constructor (gulp, config) {
    super(gulp, config)
    gulp.task(`clean`, () => this.clean())
  }

  clean () {
    return this.gulp.src(`dist/**/*`, { read: false })
      .pipe(rm())
  }
}

export default Delete
