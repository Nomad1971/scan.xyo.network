/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 2:01 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import gulp from 'gulp'
import XYO from './gulp/index'

gulp.xyo = new XYO(gulp, {
  en: {
    s3: `scan.xyo.network`,
    cf: ``,
    devs3: `scan.xyo.network`,
    devcf: ``
  }
})
