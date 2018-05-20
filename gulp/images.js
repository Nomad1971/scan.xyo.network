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

import imagemin from 'gulp-imagemin'
import gulpif from 'gulp-if'

import Base from './base'

class Images extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    gulp.task(`main-images`, () => this.mainImages())
    gulp.task(`footer-images`, () => this.footerImages())
    gulp.task(`images`, gulp.series(`footer-images`, `main-images`))
  }

  footerImages () {
    return this.gulp.src(`./node_modules/@xyo-network/website/dist/${this.language()}/img/**/*`)
      .pipe(this.dest(`img`))
  }

  mainImages () {
    return this.src(`img/**`)
      .pipe(gulpif(this.release, imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: true }
          ]
        })
      ])))
      .pipe(this.dest(`img`))
  }
}

export default Images
