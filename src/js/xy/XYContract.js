/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:22 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYContract.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, March 19, 2018 12:29 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* global $:true */

const XYBase = require(`./XYBase.js`);

class XYContract extends XYBase {
  constructor(_file, _callback) {
    super();
    const callback = _callback;
    this.file = _file;
    $.getJSON(_file, (data) => {
      console.log(`Loaded: ${_file}`);
      this.contract = data;
      callback(this);
    }, (error) => {
      this.debug(error);
      callback(null);
    });
  }

  getContract(_web3) {
    return _web3.eth.contract(JSON.parse(this.contract.interface));
  }

  getByteCode() {
    return `0x${this.contract.bytecode}`;
  }

  getInstance(_web3, _address) {
    return this.getContract(_web3).at(_address);
  }

  toString() {
    return `XYContract: ${this.name}:${this.address}`;
  }
}

module.exports = XYContract;
