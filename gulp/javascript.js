/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 14, 2018 8:44 AM
 * @Email:  developer@xyfindables.com
 * @Filename: browserify.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 2:09 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import gulpif from 'gulp-if'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'

import Base from './base.js'

class Javascript extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    gulp.task(`js`, () => this.javascript())
    gulp.task(`watch-js`, () => gulp.watch(`./src/js/**/*`, gulp.series(`js`)))
  }

  javascript () {
    const file = `all.js`
    this.log(`Building Javascript [Optimized=${this.release}]`)
    const b = browserify(`src/js/${file}`, {
      debug: !(this.release),
      targets: {
        browsers: [`last 2 versions`, `safari >= 7`]
      },
      transform: [`babelify-9`]
    })

    return b.bundle()
      .pipe(source(file).on(`error`, this.log))
      .pipe(buffer().on(`error`, this.log))
      .pipe(gulpif(!(this.release), sourcemaps.init().on(`error`, this.log)))
      .pipe(gulpif(this.release, uglify().on(`error`, this.log)))
      .pipe(gulpif(!(this.release), sourcemaps.write().on(`error`, this.log)))
      .pipe(this.dest(`js`).on(`error`, this.log))
  }
}

export default Javascript
