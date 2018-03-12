/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:22 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYContract.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:39 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const XYBase = require(`./XYBase.js`);

class XYContract extends XYBase {
  constructor(_address) {
    super();
    this.address = _address;
  }

  toString() {
    return `XYContract: ${this.address}`;
  }
}

module.exports = XYContract;
