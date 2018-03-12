/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYBase.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:36 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

class XYBase {
  static debug(_message) {
    console.log(_message);
  }

  static throwError(_message, _callback) {
    if (_callback) {
      _callback(_message, null);
    }
    throw new Error(_message);
  }

  toString() {
    return `XYBase: ${this.address}`;
  }
}

module.exports = XYBase;
