/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Friday, May 18, 2018 3:12 PM
 * @Email:  developer@xyfindables.com
 * @Filename: _header.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 1:37 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import $ from 'jquery'

$(document).ready(() => {
  const { XYO } = window
  if (XYO && XYO.ACCOUNT) {
    if (XYO.ACCOUNT.isSignedIn()) {
      $(`.signin-button`).hide()
      $(`.signout-button`).show()
    } else {
      $(`.signout-button`).hide()
      $(`.signin-button`).show()
    }
  }
})
