/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYConfig.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 23, 2018 4:14 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

const XYBase = require(`./XYBase.js`);

class XYConfig extends XYBase {
  constructor(_name) {
    super();
    this.name = _name || `default`;

    if (!this.load()) {
      // set defaults
      this.divinerAddress = `localhost:24456`;
      this.tokenAddress = `0x55296f69f40Ea6d20E478533C15A6B08B654E758`;
      this.saleAddress = `0xd840a4501df78d56ae18700dbed0c84be7def4da`;
      this.saleContractName = `XYOfficialTokenSale`;
    }
  }

  clear() {
    this.debug(`clear: ${this.name}`);
    localStorage.setItem(`xy-crypto-config-${this.name}`, `{}`);
    return this;
  }

  load() {
    const self = this;
    this.debug(`load: ${this.name}`);
    try {
      const data = localStorage.getItem(`xy-crypto-config-${this.name}`);
      const obj = JSON.parse(data);
      if (obj) {
        Object.keys(obj).forEach((key) => {
          self.debug(`Config Field: ${key}=${obj[key]}`);
          self[key] = obj[key];
        });
        return true;
      }
    } catch (ex) {
      this.debug(`Config Load Failed (Clearing): ${ex}`);
      this.clear();
    }
    return false;
  }

  save() {
    const data = JSON.stringify(this);
    this.debug(`save-data: ${data}`);
    localStorage.setItem(`xy-crypto-config-${this.name}`, data);
    return this;
  }
}

module.exports = XYConfig;
