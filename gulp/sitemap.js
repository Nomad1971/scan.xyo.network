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

import sitemap from 'gulp-sitemap'

import Base from './base'

class Sitemap extends Base {
  constructor (gulp, config) {
    super(gulp, config)
    this.gulp.task(`sitemap`, () => this.generate())
  }

  generate () {
    return this.gulp.src(`./dist/${this.language()}/**/*.html`)
      .pipe(sitemap({
        siteUrl: `https://${this.language()}.get.xyo.network`
      }))
      .pipe(this.gulp.dest(`./dist/${this.language()}`))
  }
}

module.exports = Sitemap
