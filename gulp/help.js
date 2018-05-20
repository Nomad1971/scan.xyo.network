/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, March 24, 2018 11:20 AM
 * @Email:  developer@xyfindables.com
 * @Filename: help.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import Base from './base'

class Help extends Base {
  constructor (gulp, config) {
    super(gulp, config)
    this.gulp.task(`help`, callback => this.help(callback))
  }

  help (callback) {
    this.log(`\r\n`)
    this.log(`\r\n`)
    this.log(`============================== XYO Gulp Help ==============================`)
    this.log(`\r\n`)
    this.log(` browse       Open the project in a browser`)
    this.log(` build        Start a standard build`)
    this.log(` clean        Delete the dist folder`)
    this.log(` develop      watch + browse`)
    this.log(` help         Instructions on how to use XYO's Build System (this output)`)
    this.log(` images       Copy the img folder from src to dist`)
    this.log(` invalidate   Invalidate a cloudfront distribution`)
    this.log(` javascript   Process .js files from src to dist`)
    this.log(` kit          Process .kit files from src to dist`)
    this.log(` publish      Invalidate a cloudfront distribution`)
    this.log(` sass         Process .scss files from src to dist`)
    this.log(` watch        Watch for changes in src files and then processes them`)
    this.log(`\r\n`)
    this.log(` --lang       Language To Build (i.e. --lang en)`)
    this.log(` --port       Port To Use (i.e. --port 8081)`)
    this.log(`\r\n`)
    callback()
  }
}

export default Help
