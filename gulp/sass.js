/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 9:08 AM
 * @Email:  developer@xyfindables.com
 * @Filename: sass.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import cleanCSS from 'gulp-clean-css'
import gulpSass from 'gulp-sass'
import gulpif from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'

import Base from './base'

class Sass extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    gulp.task(`sass`, () => this.sass())
    gulp.task(`watch-sass`, () => gulp.watch(`./src/css/**/*`, gulp.series(`sass`)))
  }

  sass () {
    return this.gulp.src(`./src/css/**/*.*`)
      .pipe(gulpif(!this.gulp.optimize, sourcemaps.init()))
      .pipe(gulpSass({ includePaths: [`./node_modules/`] }).on(`error`, gulpSass.logError))
      .pipe(cleanCSS())
      .pipe(gulpif(!this.gulp.optimize, sourcemaps.write()))
      .pipe(this.gulp.dest(`./dist/${this.language()}/css`))
  }
}

export default Sass
