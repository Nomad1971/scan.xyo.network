/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYConfig.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:39 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const XYBase = require(`./XYBase.js`);

class XYConfig extends XYBase {
  constructor(_name) {
    super();
    this.name = _name || `default`;

    let loaded = false;

    try {
      const data = localStorage.getItem(`xy-crypto-config-${this.name}`);
      const obj = JSON.parse(data);
      if (obj) {
        Object.keys(obj).forEach(function (key) {
          this.debug(`Config Field: ${key}=${obj[key]}`);
          this[key] = obj[key];
        });
        loaded = true;
      }
    } catch (ex) {
      this.debug(`Config Load Failed (Clearing): ${ex}`);
      this.clear();
    }
    if (!loaded) {
      // set defaults
      this.divinerAddress = `localhost:24456`;
      this.tokenAddress = `0x55296f69f40Ea6d20E478533C15A6B08B654E758`;
    }
  }

  clear(_name) {
    const name = _name || `default`;
    localStorage.setItem(`xy-crypto-config-${name}`, `{}`);
    return this;
  }

  save(_name) {
    const name = _name || `default`;
    localStorage.setItem(`xy-crypto-config-${name}`, JSON.stringify(this));
    return this;
  }
}

module.exports = XYConfig;
