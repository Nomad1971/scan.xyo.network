/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:55 AM
 * @Email:  developer@xyfindables.com
 * @Filename: codekit.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import util from 'gulp-util'
import kit from 'gulp-kit'
import htmlmin from 'gulp-htmlmin'
import gulpif from 'gulp-if'
import mustache from 'gulp-mustache'

import Base from './base'

class Kit extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    gulp.task(`kit`, () => this.kit())
    gulp.task(`watch-kit`, () => gulp.watch(`./src/**/*.kit`, gulp.series(`kit`)))
  }

  kit () {
    return this.gulp.src(`./src/**/*.kit`)
      .pipe(kit())
      .on(`error`, (err) => {
        util.log(err.message)
      })
      .pipe(mustache(`./locales/${this.language()}/strings.json`))
      .pipe(gulpif(this.config.release, htmlmin({ collapseWhitespace: true })))
      .pipe(this.gulp.dest(`./dist/${this.language()}`))
  }
}

export default Kit
