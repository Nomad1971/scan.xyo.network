/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Monday, April 9, 2018 5:01 PM
 * @Email:  developer@xyfindables.com
 * @Filename: fonts.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies: 0 */

import Base from './base'

class Fonts extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    gulp.task(`fonts`, () => this.fonts())
  }

  fonts () {
    return this.gulp.src(`./node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*`)
      .pipe(this.dest(`fonts`))
  }
}

export default Fonts
