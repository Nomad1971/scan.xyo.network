/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:02 AM
 * @Email:  developer@xyfindables.com
 * @Filename: serve.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import gulp from 'gulp'
import server from 'gulp-server-io'
import { argv } from 'yargs'

class Browse {
  constructor () {
    this.port = argv.port || 8080
    this.lang = argv.lang || `en`
    gulp.task(`browse`, () => this.browse())
  }

  browse () {
    return gulp.src(`./dist/${this.lang}`)
      .pipe(server())
  }
}

export default Browse
