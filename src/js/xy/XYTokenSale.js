/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:46 AM
 * @Email:  developer@xyfindables.com
 * @Filename: index.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:39 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */
/* eslint max-len: 0 */

const XYContract = require(`./XYContract.js`);

const XYSolidity = require(`xyo-solidity`);

class XYTokenSale extends XYContract {
  constructor(_address) {
    super();
    this.address = _address;
    this.contract = XYSolidity.load(`XYTokenSale`);
  }
}

module.exports = XYTokenSale;
