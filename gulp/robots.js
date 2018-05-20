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

import robots from 'gulp-robots'

import Base from './base'

class Robots extends Base {
  constructor (gulp, config) {
    super(gulp, config)
    gulp.task(`robots`, () => this.robots())
  }

  robots () {
    return this.gulp.src(`./dist/${this.language()}/index.html`)
      .pipe(robots({
        useragent: `*`,
        disallow: [`js/`, `css/`],
        sitemap: `sitemap.xml`
      }))
      .pipe(this.gulp.dest(`./dist/${this.language()}`))
  }
}

export default Robots
