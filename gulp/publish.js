/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, March 23, 2018 12:21 PM
 * @Email:  developer@xyfindables.com
 * @Filename: publissh.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint import/no-extraneous-dependencies:0 */
/* eslint prefer-destructuring:0 */

import confirm from 'gulp-confirm'

import merge from 'merge-stream'
import parallelize from 'concurrent-transform'
import cloudfront from 'gulp-cloudfront-invalidate-aws-publish'
import awspublish from 'gulp-awspublish'

import Base from './base'

class Publish extends Base {
  constructor (gulp, config) {
    super(gulp, config)

    this.gulp.task(`innerPublishAll`, (callback) => {
      this.confirm(`all`).then(() => {
        Publish.instance.publishAll()
        callback()
      })
    })

    this.gulp.task(`innerPublish`, callback => this.publish(callback, true))
    this.gulp.task(`publish`, gulp.series(`build`, `innerPublish`))
    this.gulp.task(`publish-nobuild`, gulp.series(`innerPublish`))
  }

  publishAll (callback) {
    this.log(`publishAll`)
    const tasks = []
    Object.keys(this.config).forEach((key) => {
      this.log(`publishAll:${key}`)
      const config = this.config[key]
      this.gulp.task(`publish-${key}`, () => { this.publish(key, config.s3) })
      tasks.push(`publish-${key}`)
    })
    this.gulp.series(tasks, callback)
  }

  publish (callback, confirmPublish) {
    this.log(`publish: ${this.lang}`)

    const config = this.config()

    let cf = config.devcf
    let s3 = config.devs3

    if (this.release) {
      cf = config.cf
      s3 = config.s3
    }

    if (confirmPublish) {
      this.confirm(s3)
        .catch(() => null)
    }

    const publisher = awspublish.create({
      region: `us-east-1`,
      params: {
        Bucket: s3
      }
    }, {
      cacheFileName: `awspublish-${s3}.cache`
    })

    const headers = {
      'Cache-Control': `max-age=3600, no-transform, public`
    }

    const gzip = this.gulp.src(`./dist/${this.language()}/**/*.*`).pipe(awspublish.gzip())
    const plain = this.gulp.src(`./dist/${this.language()}/**/*.*`)

    if (!config) {
      this.log(`Can't publish - No config set`)
      return null
    }

    return merge(gzip, plain)
      .pipe(parallelize(publisher.publish(headers), 50))
      .pipe(parallelize(publisher.sync(), 50))
      .pipe(cloudfront({ distribution: cf, indexRootPath: true }))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  }

  confirm (bucket) {
    return new Promise((resolve, reject) => {
      this.gulp.src(``)
        .pipe(confirm({
          question: `Type project(${bucket}) name to publish:`,
          proceed: (answer) => {
            if (answer !== bucket) {
              this.log(`Wrong project: Exiting!`)
              process.exit()
            }
            resolve(true)
          }
        }))
    })
  }
}

export default Publish
