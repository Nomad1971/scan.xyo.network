/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYBase.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, March 12, 2018 11:39 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */

class XYBase {
  debug(_message) {
    if (typeof _message === `string`) {
      console.log(`${this.constructor.name}: ${_message}`);
    } else {
      console.log(`${this.constructor.name}: ${JSON.stringify(_message)}`);
    }
  }

  static throwError(_message, _callback) {
    if (_callback) {
      _callback(_message, null);
    }
    throw new Error(_message);
  }

  toString() {
    return `${this.constructor.name}: ${this.address}`;
  }
}

module.exports = XYBase;
