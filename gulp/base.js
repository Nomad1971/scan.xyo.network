/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Monday, May 14, 2018 1:16 PM
 * @Email:  developer@xyfindables.com
 * @Filename: base.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:36 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import { argv } from 'yargs'
import util from 'gulp-util'

class XYOGulpBase {
  constructor (gulp, config) {
    this.gulp = gulp
    this.configData = config
    this.util = util
    this.log = util.log

    this.port = argv.port || 8080
    this.lang = argv.lang || `en`
    this.release = !!(argv.release)
  }

  dest (_folder) {
    const folder = _folder || ``
    if (this.lang) {
      return this.gulp.dest(`./dist/${this.lang}/${folder}`)
    }
    return this.gulp.dest(`./dist/${folder}`)
  }

  src (_folder) {
    const folder = _folder || ``
    return this.gulp.src(`./src/${folder}`)
  }

  config (_lang) {
    const lang = _lang || this.lang || `en`
    return this.configData[lang]
  }

  language () {
    return this.lang || `en`
  }
}

export default XYOGulpBase
