/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Sunday, March 11, 2018 10:20 PM
 * @Email:  developer@xyfindables.com
 * @Filename: XYClient.js
 * @Last modified by:   arietrouw
 * @Last modified time: Wednesday, March 14, 2018 5:33 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */


const XYBase = require(`./XYBase.js`);
const XYConfig = require(`./XYConfig.js`);
const XYContract = require(`./XYContract.js`);

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

  getCurrentSaleContract(callback) {
    return new XYContract(this.config.saleContractFile, callback).atAddress(this.config.saleAddress);
  }

  toBigInt(_value, _places) {
    const places = _places || 18;
    return new this.web3.BigNumber(_value).shift(places);
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

  getTokenBalance(_callback) {
    const contractFile = `/contracts/TokenSale/lib/ERC20.json`;
    const _ = new XYContract(contractFile, (contract) => {
      try {
        console.log(`Get Token Balance: ${this.config.tokenAddress}`);
        const instance = contract.getInstance(this.getWeb3(), this.config.tokenAddress);
        instance.balanceOf(this.getDAppAddress(), (error, result) => {
          if (error) {
            _callback(error, null);
          } else {
            _callback(null, result);
          }
        });
      } catch (ex) {
        console.error(ex);
      }
    });
  }
}

module.exports = XYClient;
