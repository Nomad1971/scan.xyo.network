/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:31 AM
 * @Email:  developer@xyfindables.com
 * @Filename: index.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint global-require: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import Browse from './browse'
import Clean from './clean'
import Fonts from './fonts'
import Help from './help'
import Images from './images'
import Javascript from './javascript'
import Kit from './codeKit'
import Publish from './publish'
import Robots from './robots'
import Sass from './sass'
import Sitemap from './sitemap'

class XYO {
  constructor (gulp, config) {
    this.browse = new Browse(gulp, config)
    this.clean = new Clean(gulp, config)
    this.fonts = new Fonts(gulp, config)
    this.help = new Help(gulp, config)
    this.images = new Images(gulp, config)
    this.javascript = new Javascript(gulp, config)
    this.kit_localized = new Kit(gulp, config)
    this.sass = new Sass(gulp, config)
    this.sitemap = new Sitemap(gulp, config)
    this.robots = new Robots(gulp, config)

    gulp.task(`default`, gulp.series(`help`))

    gulp.task(
      `build`,
      gulp.series(
        `clean`,
        gulp.parallel(
          `sass`,
          `js`,
          `kit`,
          `images`,
          `fonts`
        ),
        gulp.parallel(
          `sitemap`,
          `robots`
        )
      ),
      (callback) => { callback() }
    )

    this.publish = new Publish(gulp, config)

    gulp.task(
      `develop`,
      gulp.series(
        `build`,
        `browse`,
        gulp.parallel(`watch-js`, `watch-sass`, `watch-kit`)
      ),
      (callback) => { callback() }
    )
  }
}

module.exports = XYO
