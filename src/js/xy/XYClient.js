/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYClient.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:53 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* global Web3:true */
/* global web3:true */

const XYBase = require(`./XYBase.js`);
const XYConfig = require(`./XYConfig.js`);

class XYClient extends XYBase {
  constructor(_onWalletChange) {
    super();
    const self = this;

    if (typeof web3 === `undefined`) {
      throw new Error(`Web3 Undefined`);
    } else {
      this.web3 = Web3(window.web3.currentProvider);
    }

    this.config = new XYConfig();
    this.etherWallet = null;
    this.onWalletChange = _onWalletChange;
    this.xyoNetworkName = `XYO-Main`;
    setTimeout(() => {
      self.checkWalletAddress();
    }, 0);
    setInterval(() => {
      self.checkWalletAddress();
    }, 1000);
  }

  checkWalletAddress() {
    if (this.etherWallet !== this.web3.eth.accounts[0]) {
      const wallet = this.web3.eth.accounts[0];
      this.etherWallet = wallet;
      if (this.onWalletChange) {
        this.onWalletChange();
      }
    }
    return this.etherWallet;
  }

  getDAppAddress() {
    return this.checkWalletAddress();
  }

  getDAppNetworkName(_callback) {
    this.web3.version.getNetwork((_error, _netId) => {
      switch (_netId) {
        case `1`:
          _callback(null, `ETH-Main`);
          break;
        case `2`:
          _callback(null, `ETH-Morden`);
          break;
        case `3`:
          _callback(null, `ETH-Ropsten`);
          break;
        case `4`:
          _callback(null, `ETH-Rinkeby`);
          break;
        case `42`:
          _callback(null, `ETH-Kovan`);
          break;
        default:
          _callback(null, `Custom: ${_netId}`);
          break;
      }
    });
  }

  getXyoNetworkName(_callback) {
    _callback(null, this.xyoNetworkName);
  }

  getDAppBalance(_callback) {
    const self = this;
    self.web3.eth.getBalance(self.etherWallet, (_error, _result) => {
      if (_error) {
        _callback(_error, null);
      } else {
        _callback(null, {
          raw: _result,
          cooked: self.web3.fromWei(_result, `ether`),
        });
      }
    });
  }

  static toBigInt(_value) {
    this.debug(`toBigInt: ${_value}`);
    const stringVal = _value.toString();
    const decimalSplit = stringVal.split(`.`);
    let zerosToAdd = 18;
    if (decimalSplit.length > 1) {
      zerosToAdd -= decimalSplit[1].length;
    }
    let value = decimalSplit.join(``);
    this.debug(`toBigInt2: ${value}`);
    while (zerosToAdd) {
      value += `0`;
      zerosToAdd -= 1;
    }
    this.debug(`toBigInt3: ${value}`);
    return new Web3.BigNumber(value);
  }

  checkAddress(_address) {
    if (!this.web3.isAddress(_address)) {
      let message = `Invalid Address: `;
      if (_address) {
        if (_address.length > 0) {
          message += _address;
        } else {
          message += `Zero Length`;
        }
      } else {
        message += `Empty`;
      }
      this.throwError(message);
    }
  }

  transfer(_address, _amount, _callback) {
    this.debug(`transfer: ${_address}, ${_amount}`);
    this.checkAddress(_address);
    const amount = this.toBigInt(_amount);
    const xyContract = this.getXyoTokenContract();
    const xyInstance = xyContract.at(this.config.getXyoTokenContractAddress());
    xyInstance.transfer(_address, amount, { gasPrice: 10000000000 }, (_error, _result) => {
      if (_error) {
        this.debug(`Error: ${_error}`);
        _callback(_error, null);
      } else {
        this.debug(`Success: ${_result}`);
        _callback(null, _result);
      }
    });
  }

  getXyoBalance(_callback) {
    const self = this;
    self.web3.eth.call({
      to: `0x55296f69f40Ea6d20E478533C15A6B08B654E758`,
      data: `0x70a08231000000000000000000000000${self.web3.eth.accounts[0].substring(2)}`,
    }, (_error, _result) => {
      if (_error) {
        _callback(_error, null);
      } else if (_result.length < 3) {
        _callback(null, 0);
      } else {
        _callback(null, {
          raw: _result,
          cooked: self.web3.fromWei(_result, `ether`),
        });
      }
    });
  }
}

module.exports = XYClient;
