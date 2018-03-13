/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYClient.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, March 12, 2018 6:14 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */


const XYBase = require(`./XYBase.js`);
const XYConfig = require(`./XYConfig.js`);

class XYClient extends XYBase {
  constructor(_onWalletChange) {
    super();

    this.config = new XYConfig();
    this.etherWallet = null;
    this.onWalletChange = _onWalletChange;
    this.tokenPlaces = 18;
    this.xyoNetworkName = `XYO-Main`;
    this.checkWalletAddress();
  }

  toBigInt(_value) {
    console.log(`toBigInt: ${_value}`);
    const stringVal = _value.toString();
    const decimalSplit = stringVal.split(`.`);
    let zerosToAdd = this.tokenPlaces;
    if (decimalSplit.length > 1) {
      zerosToAdd -= decimalSplit[1].length;
    }
    let value = decimalSplit.join(``);
    console.log(`toBigInt2: ${value}`);
    while (zerosToAdd) {
      value += `0`;
      zerosToAdd -= 1;
    }
    console.log(`toBigInt3: ${value}`);
    return new this.web3.BigNumber(value);
  }

  getWeb3() {
    if (this.web3) {
      return this.web3;
    } else if (!(window.web3)) {
      throw new Error(`Web3 Undefined`);
    } else {
      this.web3 = new window.Web3(window.web3.currentProvider);
      this.BigNumber = this.web3.BigNumber;
      return this.web3;
    }
  }

  checkWalletAddress() {
    const web3 = this.getWeb3();
    if (web3 && this.etherWallet !== web3.eth.accounts[0]) {
      console.log(`Wallet Changed`);
      const wallet = web3.eth.accounts[0];
      this.etherWallet = wallet;
      if (this.onWalletChange) {
        this.onWalletChange(this);
      }
    } else {
      setTimeout(() => {
        this.checkWalletAddress.call(this);
      }, 100);
    }
    return this.etherWallet;
  }

  getDAppAddress() {
    return this.checkWalletAddress();
  }

  getDAppNetworkName(_callback) {
    const web3 = this.getWeb3();
    web3.version.getNetwork((_error, _netId) => {
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
    const web3 = this.getWeb3();
    web3.eth.getBalance(this.etherWallet, (_error, _result) => {
      if (_error) {
        _callback(_error, null);
      } else {
        _callback(null, {
          raw: _result,
          cooked: web3.fromWei(_result, `ether`),
        });
      }
    });
  }

  checkAddress(_address) {
    const web3 = this.getWeb3();
    if (!web3.isAddress(_address)) {
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

  getXyoBalance(_callback) {
    const web3 = this.getWeb3();
    web3.eth.call({
      to: this.config.tokenAddress,
      data: `0x70a08231000000000000000000000000${web3.eth.accounts[0].substring(2)}`,
    }, (_error, _result) => {
      if (_error) {
        _callback(_error, null);
      } else if (_result.length < 3) {
        _callback(null, 0);
      } else {
        _callback(null, {
          raw: _result,
          cooked: web3.fromWei(_result, `ether`),
        });
      }
    });
  }
}

module.exports = XYClient;
