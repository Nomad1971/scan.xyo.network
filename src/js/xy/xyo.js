/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: xyo.js
 * @Last modified by:   arietrouw
 * @Last modified time: Thursday, March 8, 2018 10:55 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* global Web3:true */
/* global web3:true */
/* global XYO:true */
/* eslint no-console: 0 */
/* eslint max-len: 0 */

window.XYO = window.XYO || {
};

XYO.BASE = XYO.BASE || function (_address) {
  this.address = _address;
};

XYO.BASE.prototype.toString = function () {
  return `XYO.BASE: ${this.address}`;
};

XYO.CONFIG = XYO.CONFIG || function (_name) {
  const name = _name || `default`;
  let loaded = false;

  try {
    const data = localStorage.getItem(`xy-crypto-config-${name}`);
    const obj = JSON.parse(data);
    if (obj) {
      Object.keys(obj).forEach(function (key) {
        console.log(`Config Field: ${key}=${obj[key]}`);
        this[key] = obj[key];
      });
      loaded = true;
    }
  } catch (ex) {
    console.log(`Config Load Failed (Clearing): ${ex}`);
    this.clear();
  }
  if (!loaded) {
    // set defaults
    this.diviner = `localhost:24456`;
  }
};

XYO.CONFIG.prototype = new XYO.BASE();
XYO.CONFIG.constructor = XYO.CONFIG;

XYO.CONFIG.prototype.getXyoTokenContractAddress = function () {
  return `0x55296f69f40Ea6d20E478533C15A6B08B654E758`;
};

XYO.CONFIG.prototype.setDivinerAddress = function (_diviner) {
  this.diviner = _diviner;
  return this;
};

XYO.CONFIG.prototype.getDivinerAddress = function () {
  return this.diviner;
};

XYO.CONFIG.prototype.setUncalibratedContractAddress = function (_address) {
  this.uncalibratedContractAddress = _address;
  return this;
};

XYO.CONFIG.prototype.getUncalibratedContractAddress = function () {
  return this.uncalibratedContractAddress;
};

XYO.CONFIG.prototype.setCalibratedContractAddress = function (_address) {
  this.calibratedContractAddress = _address;
  return this;
};

XYO.CONFIG.prototype.getCalibratedContractAddress = function () {
  return this.calibratedContractAddress;
};

XYO.CONFIG.prototype.setRelativeContractAddress = function (_address) {
  this.relativeContractAddress = _address;
  return this;
};

XYO.CONFIG.prototype.getRelativeContractAddress = function () {
  return this.relativeContractAddress;
};

XYO.CONFIG.prototype.clear = function (_name) {
  const name = _name || `default`;
  localStorage.setItem(`xy-crypto-config-${name}`, `{}`);
  return this;
};

XYO.CONFIG.prototype.save = function (_name) {
  const name = _name || `default`;
  localStorage.setItem(`xy-crypto-config-${name}`, JSON.stringify(this));
  return this;
};

XYO.CLIENT = XYO.CLIENT || function (_onWalletChange) {
  const self = this;
  if (typeof web3 === `undefined`) {
    throw new Error(`Web3 Undefined`);
  }
  this.web3 = new Web3(web3.currentProvider);
  this.config = new XYO.CONFIG();
  this.etherWallet = null;
  this.onWalletChange = _onWalletChange;
  setTimeout(() => {
    self.checkWalletAddress();
  }, 0);
  setInterval(() => {
    self.checkWalletAddress();
  }, 1000);
};

XYO.CLIENT.prototype = new XYO.BASE();
XYO.CLIENT.constructor = XYO.CLIENT;

XYO.CLIENT.prototype.checkWalletAddress = function () {
  if (this.etherWallet !== this.web3.eth.accounts[0]) {
    const wallet = this.web3.eth.accounts[0];
    this.etherWallet = wallet;
    if (this.onWalletChange) {
      this.onWalletChange();
    }
  }
  return this.etherWallet;
};

XYO.CLIENT.prototype.getDAppAddress = function () {
  return this.checkWalletAddress();
};

XYO.CLIENT.prototype.getDAppNetworkName = function (_callback) {
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
};

XYO.CLIENT.prototype.getXyoNetworkName = function (_callback) {
  _callback(null, `XYO-Main`);
};

XYO.CLIENT.prototype.getDAppBalance = function (_callback) {
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
};

XYO.CLIENT.prototype.toBigInt = function (_value) {
  console.log(`toBigInt: ${_value}`);
  const stringVal = _value.toString();
  const decimalSplit = stringVal.split(`.`);
  let zerosToAdd = 18;
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
  return new web3.BigNumber(value);
};

XYO.CLIENT.prototype.throwError = function (_message, _callback) {
  if (_callback) {
    _callback(_message, null);
  }
  throw new Error(_message);
};

XYO.CLIENT.prototype.checkAddress = function (_address) {
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
};

XYO.CLIENT.prototype.transfer = function (_address, _amount, _callback) {
  console.log(`transfer: ${_address}, ${_amount}`);
  this.checkAddress(_address);
  const amount = this.toBigInt(_amount);
  const xyContract = this.getXyoTokenContract();
  const xyInstance = xyContract.at(this.config.getXyoTokenContractAddress());
  xyInstance.transfer(_address, amount, { gasPrice: 10000000000 }, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      _callback(_error, null);
    } else {
      console.log(`Success: ${_result}`);
      _callback(null, _result);
    }
  });
};

XYO.CLIENT.prototype.getXyoBalance = function (_callback) {
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
};

XYO.CLIENT.prototype.getXyoTokenContract = function () {
  return this.web3.eth.contract([{
    constant: true,
    inputs: [],
    name: `totalSupply`,
    outputs: [{
      name: ``,
      type: `uint256`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `symbol`,
    outputs: [{
      name: ``,
      type: `string`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `name`,
    outputs: [{
      name: ``,
      type: `string`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `decimals`,
    outputs: [{
      name: ``,
      type: `uint8`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    },
    {
      name: ``,
      type: `address`,
    },
    ],
    name: `allowance`,
    outputs: [{
      name: ``,
      type: `uint256`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `balanceOf`,
    outputs: [{
      name: ``,
      type: `uint256`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    inputs: [{
      name: `initialSupply`,
      type: `uint256`,
    },
    {
      name: `tokenName`,
      type: `string`,
    },
    {
      name: `tokenSymbol`,
      type: `string`,
    },
    ],
    payable: false,
    stateMutability: `nonpayable`,
    type: `constructor`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: true,
      name: `from`,
      type: `address`,
    },
    {
      indexed: false,
      name: `value`,
      type: `uint256`,
    },
    ],
    name: `Burn`,
    type: `event`,
  },
  {
    constant: false,
    inputs: [{
      name: `_from`,
      type: `address`,
    },
    {
      name: `_to`,
      type: `address`,
    },
    {
      name: `_value`,
      type: `uint256`,
    },
    ],
    name: `transferFrom`,
    outputs: [{
      name: `success`,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: true,
      name: `from`,
      type: `address`,
    },
    {
      indexed: true,
      name: `to`,
      type: `address`,
    },
    {
      indexed: false,
      name: `value`,
      type: `uint256`,
    },
    ],
    name: `Transfer`,
    type: `event`,
  },
  {
    constant: false,
    inputs: [{
      name: `_from`,
      type: `address`,
    },
    {
      name: `_value`,
      type: `uint256`,
    },
    ],
    name: `burnFrom`,
    outputs: [{
      name: `success`,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_spender`,
      type: `address`,
    },
    {
      name: `_value`,
      type: `uint256`,
    },
    ],
    name: `approve`,
    outputs: [{
      name: `success`,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_spender`,
      type: `address`,
    },
    {
      name: `_value`,
      type: `uint256`,
    },
    {
      name: `_extraData`,
      type: `bytes`,
    },
    ],
    name: `approveAndCall`,
    outputs: [{
      name: `success`,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_to`,
      type: `address`,
    },
    {
      name: `_value`,
      type: `uint256`,
    },
    ],
    name: `transfer`,
    outputs: [],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_value`,
      type: `uint256`,
    }],
    name: `burn`,
    outputs: [{
      name: `success`,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  ]);
};

XYO.CLIENT.prototype.getUncalibratedContract = function () {
  return this.web3.eth.contract([{
    constant: false,
    inputs: [{
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_latitude`,
      type: `int256`,
    },
    {
      name: `_longitude`,
      type: `int256`,
    },
    {
      name: `_altitude`,
      type: `int256`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    ],
    name: `publishAnswer`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `answeredQueries`,
    outputs: [{
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `latitude`,
      type: `int256`,
    },
    {
      name: `longitude`,
      type: `int256`,
    },
    {
      name: `altitude`,
      type: `int256`,
    },
    {
      name: `accuracy`,
      type: `uint256`,
    },
    {
      name: `certainty`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_xyoValue`,
      type: `uint256`,
    },
    {
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_delay`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    {
      name: `_xynotify`,
      type: `address`,
    },
    ],
    name: `publishQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `pendingQueries`,
    outputs: [{
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `accuracyThreshold`,
      type: `uint256`,
    },
    {
      name: `certaintyThresold`,
      type: `uint256`,
    },
    {
      name: `minimumDelay`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    {
      name: `xynotify`,
      type: `address`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `uint256`,
    }],
    name: `answerList`,
    outputs: [{
      name: ``,
      type: `address`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `hasPendingQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `delay`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `QueryReceived`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `latitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `longitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `altitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `AnswerReceived`,
    type: `event`,
  },
  ]);
};

XYO.CLIENT.prototype.getCalibratedContract = function () {
  return this.web3.eth.contract([{
    constant: false,
    inputs: [{
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_latitude`,
      type: `int256`,
    },
    {
      name: `_longitude`,
      type: `int256`,
    },
    {
      name: `_altitude`,
      type: `int256`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    ],
    name: `publishAnswer`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `answeredQueries`,
    outputs: [{
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `latitude`,
      type: `int256`,
    },
    {
      name: `longitude`,
      type: `int256`,
    },
    {
      name: `altitude`,
      type: `int256`,
    },
    {
      name: `accuracy`,
      type: `uint256`,
    },
    {
      name: `certainty`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `pendingQueries`,
    outputs: [{
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `accuracyThreshold`,
      type: `uint256`,
    },
    {
      name: `certaintyThresold`,
      type: `uint256`,
    },
    {
      name: `minimumDelay`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    {
      name: `calibrationAddress`,
      type: `address`,
    },
    {
      name: `calibrationLatitude`,
      type: `int256`,
    },
    {
      name: `calibrationLongitude`,
      type: `int256`,
    },
    {
      name: `calibrationAltitude`,
      type: `int256`,
    },
    {
      name: `xynotify`,
      type: `address`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `uint256`,
    }],
    name: `answerList`,
    outputs: [{
      name: ``,
      type: `address`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_xyoValue`,
      type: `uint256`,
    },
    {
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_delay`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    {
      name: `_calibrationAddress`,
      type: `address`,
    },
    {
      name: `_calibrationLatitude`,
      type: `int256`,
    },
    {
      name: `_calibrationLongitude`,
      type: `int256`,
    },
    {
      name: `_calibrationAltitude`,
      type: `int256`,
    },
    {
      name: `_xynotify`,
      type: `address`,
    },
    ],
    name: `publishQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `hasPendingQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `delay`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `calibrationAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `calibrationLatitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `calibrationLongitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `calibrationAltitude`,
      type: `int256`,
    },
    ],
    name: `QueryReceived`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `latitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `longitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `altitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `AnswerReceived`,
    type: `event`,
  },
  ]);
};

XYO.CLIENT.prototype.getFencedContract = function () {
  return this.web3.eth.contract([{
    constant: false,
    inputs: [{
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_latitude`,
      type: `int256`,
    },
    {
      name: `_longitude`,
      type: `int256`,
    },
    {
      name: `_altitude`,
      type: `int256`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    ],
    name: `publishAnswer`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `answeredQueries`,
    outputs: [{
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `latitude`,
      type: `int256`,
    },
    {
      name: `longitude`,
      type: `int256`,
    },
    {
      name: `altitude`,
      type: `int256`,
    },
    {
      name: `accuracy`,
      type: `uint256`,
    },
    {
      name: `certainty`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_xyoValue`,
      type: `uint256`,
    },
    {
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_delay`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    {
      name: `_xynotify`,
      type: `address`,
    },
    ],
    name: `publishQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `pendingQueries`,
    outputs: [{
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `accuracyThreshold`,
      type: `uint256`,
    },
    {
      name: `certaintyThresold`,
      type: `uint256`,
    },
    {
      name: `minimumDelay`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    {
      name: `xynotify`,
      type: `address`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `uint256`,
    }],
    name: `answerList`,
    outputs: [{
      name: ``,
      type: `address`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `hasPendingQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `delay`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `QueryReceived`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `latitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `longitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `altitude`,
      type: `int256`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `AnswerReceived`,
    type: `event`,
  },
  ]);
};

XYO.CLIENT.prototype.getRelativeContract = function () {
  return this.web3.eth.contract([{
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `answeredQueries`,
    outputs: [{
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `range`,
      type: `uint256`,
    },
    {
      name: `accuracy`,
      type: `uint256`,
    },
    {
      name: `certainty`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `address`,
    }],
    name: `pendingQueries`,
    outputs: [{
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      name: `xyoAddress`,
      type: `address`,
    },
    {
      name: `accuracyThreshold`,
      type: `uint256`,
    },
    {
      name: `certaintyThresold`,
      type: `uint256`,
    },
    {
      name: `minimumDelay`,
      type: `uint256`,
    },
    {
      name: `epoch`,
      type: `uint256`,
    },
    {
      name: `relativeAddress`,
      type: `address`,
    },
    {
      name: `xynotify`,
      type: `address`,
    },
    ],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_range`,
      type: `uint256`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    ],
    name: `publishAnswer`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [{
      name: ``,
      type: `uint256`,
    }],
    name: `answerList`,
    outputs: [{
      name: ``,
      type: `address`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: true,
    inputs: [],
    name: `hasPendingQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `view`,
    type: `function`,
  },
  {
    constant: false,
    inputs: [{
      name: `_xyoValue`,
      type: `uint256`,
    },
    {
      name: `_xyoAddress`,
      type: `address`,
    },
    {
      name: `_accuracy`,
      type: `uint256`,
    },
    {
      name: `_certainty`,
      type: `uint256`,
    },
    {
      name: `_delay`,
      type: `uint256`,
    },
    {
      name: `_epoch`,
      type: `uint256`,
    },
    {
      name: `_relativeAddress`,
      type: `address`,
    },
    {
      name: `_xynotify`,
      type: `address`,
    },
    ],
    name: `publishQuery`,
    outputs: [{
      name: ``,
      type: `bool`,
    }],
    payable: false,
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoValue`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `delay`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `relativeAddress`,
      type: `address`,
    },
    ],
    name: `QueryReceived`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: `xyoAddress`,
      type: `address`,
    },
    {
      indexed: false,
      name: `range`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `accuracy`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `certainty`,
      type: `uint256`,
    },
    {
      indexed: false,
      name: `epoch`,
      type: `uint256`,
    },
    ],
    name: `AnswerReceived`,
    type: `event`,
  },
  ]);
};

XYO.CLIENT.prototype.initializeUncalibratedContract = function (_address, _callback) {
  console.log(`initializeUncalibratedContract`);
  const self = this;
  if (this.config.getUncalibratedContractAddress()) {
    _callback(null, this.config.getUncalibratedContractAddress());
  } else if (_address) {
    this.checkAddress(_address);
    this.config.setUncalibratedContractAddress(_address);
    this.config.save();
    _callback(null, _address);
  } else {
    const xyContract = this.getUncalibratedContract();
    xyContract.new({
      from: web3.eth.accounts[0],
      data: `6060604052341561000f57600080fd5b610bc88061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312b749321461007d5780632afe70fd146101045780634540b9a3146101a75780637fc4077e14610244578063c9930ee014610313578063e491650e14610376575b600080fd5b341561008857600080fd5b6100ea600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506103a3565b604051808215151515815260200191505060405180910390f35b341561010f57600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107c1565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34156101b257600080fd5b61022a600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610823565b604051808215151515815260200191505060405180910390f35b341561024f57600080fd5b61027b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a2e565b604051808881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390f35b341561031e57600080fd5b6103346004808035906020019091905050610ab0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561038157600080fd5b610389610aef565b604051808215151515815260200191505060405180910390f35b600060e0604051908101604052808973ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187815260200186815260200185815260200184815260200183815250600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060155905050600280548060010182816104c89190610b4b565b916000526020600020900160008a909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561071f576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371975d61898989898989896040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001828152602001975050505050505050600060405180830381600087803b151561070a57600080fd5b6102c65a03f1151561071b57600080fd5b5050505b7fd9fc59387261346eaef71cb06e6c131973f262bd4f463dd327006a4d0a13fdf388888888888888604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390a160019050979650505050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050154908060060154905087565b6000808811151561083357600080fd5b60e0604051908101604052808981526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f7504dfe211cd7e5a51d6cdcb9245552a436b075780a13f65320a855106648f64888888888888604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390a160019050979650505050505050565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905087565b600281815481101515610abf57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610b435760019050610b48565b600090505b90565b815481835581811511610b7257818360005260206000209182019101610b719190610b77565b5b505050565b610b9991905b80821115610b95576000816000905550600101610b7d565b5090565b905600a165627a7a7230582053ee17a43d483ccbc8f9f104048502f6b2cfcd398e9e14e1463e09086d1ecd630029`,
      gas: `4700000`,
    }, (_error, _contract) => {
      if (_error) {
        _callback(_error, null);
      } else {
        self.web3.eth.getTransactionReceipt(_contract.transactionHash, (_innerError, _result) => {
          if (_innerError) {
            console.log(`Error: ${_innerError}`);
            _callback(_innerError, null);
          } else {
            self.config.setUncalibratedContractAddress(_result.contractAddress);
            self.config.save();
            _callback(null, _result.contractAddress);
          }
        });
      }
    });
  }
};

XYO.CLIENT.prototype.initializeCalibratedContract = function (_address, _callback) {
  console.log(`initializeCalibratedContract`);
  const self = this;
  if (this.config.getCalibratedContractAddress()) {
    _callback(null, this.config.getCalibratedContractAddress());
  } else if (_address) {
    this.checkAddress(_address);
    this.config.setCalibratedContractAddress(_address);
    this.config.save();
    _callback(null, _address);
  } else {
    const xyContract = this.getCalibratedContract();
    xyContract.new({
      from: web3.eth.accounts[0],
      data: `6060604052341561000f57600080fd5b610d698061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312b749321461007d5780632afe70fd146101045780637fc4077e146101a7578063c9930ee0146102be578063dee342c714610321578063e491650e146103f8575b600080fd5b341561008857600080fd5b6100ea600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091905050610425565b604051808215151515815260200191505060405180910390f35b341561010f57600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610843565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34156101b257600080fd5b6101de600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108a5565b604051808c81526020018b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018a81526020018981526020018881526020018781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019b50505050505050505050505060405180910390f35b34156102c957600080fd5b6102df600480803590602001909190505061095f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561032c57600080fd5b6103de600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061099e565b604051808215151515815260200191505060405180910390f35b341561040357600080fd5b61040b610c90565b604051808215151515815260200191505060405180910390f35b600060e0604051908101604052808973ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187815260200186815260200185815260200184815260200183815250600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c082015181600601559050506002805480600101828161054a9190610cec565b916000526020600020900160008a909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156107a1576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371975d61898989898989896040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001828152602001975050505050505050600060405180830381600087803b151561078c57600080fd5b6102c65a03f1151561079d57600080fd5b5050505b7fd9fc59387261346eaef71cb06e6c131973f262bd4f463dd327006a4d0a13fdf388888888888888604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390a160019050979650505050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050154908060060154905087565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600701549080600801549080600901549080600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508b565b60028181548110151561096e57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000808c1115156109ae57600080fd5b610160604051908101604052808d81526020018c73ffffffffffffffffffffffffffffffffffffffff1681526020018b81526020018a81526020018981526020018881526020018773ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e082015181600701556101008201518160080155610120820151816009015561014082015181600a0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f08cdcff0f6b9d92cc47f724bdc741dad25b6e65d9343143ab70454dac8fc44f08c8c8c8c8c8c8c8c8c8c604051808b81526020018a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018981526020018881526020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281526020019a505050505050505050505060405180910390a1600190509b9a5050505050505050505050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610ce45760019050610ce9565b600090505b90565b815481835581811511610d1357818360005260206000209182019101610d129190610d18565b5b505050565b610d3a91905b80821115610d36576000816000905550600101610d1e565b5090565b905600a165627a7a723058200f64aa42af6d8ff57d153008bfd139a3c87731f4a1712a09dc4076b6407a840c0029`,
      gas: `4700000`,
    }, (_error, _contract) => {
      if (_error) {
        _callback(_error, null);
      } else {
        self.web3.eth.getTransactionReceipt(_contract.transactionHash, (_innerError, _result) => {
          if (_innerError) {
            console.log(`Error: ${_innerError}`);
            _callback(_innerError, null);
          } else {
            self.config.setCalibratedContractAddress(_result.contractAddress);
            self.config.save();
            _callback(null, _result.contractAddress);
          }
        });
      }
    });
  }
};

XYO.CLIENT.prototype.initializeRelativeContract = function (_address, _callback) {
  console.log(`initializeRelativeContract`);
  const self = this;
  if (this.config.getRelativeContractAddress()) {
    _callback(null, this.config.getRelativeContractAddress());
  } else if (_address) {
    this.checkAddress(_address);
    this.config.setRelativeContractAddress(_address);
    this.config.save();
    _callback(null, _address);
  } else {
    const xyContract = this.getRelativeContract();
    xyContract.new({
      from: web3.eth.accounts[0],
      data: `6060604052341561000f57600080fd5b610c6b8061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632afe70fd1461007d5780637fc4077e146101125780638b09220b14610214578063c9930ee014610289578063e491650e146102ec578063f8cd575014610319575b600080fd5b341561008857600080fd5b6100b4600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506103d5565b604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018281526020019550505050505060405180910390f35b341561011d57600080fd5b610149600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061042b565b604051808981526020018873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019850505050505050505060405180910390f35b341561021f57600080fd5b61026f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506104d3565b604051808215151515815260200191505060405180910390f35b341561029457600080fd5b6102aa60048080359060200190919050506108af565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102f757600080fd5b6102ff6108ee565b604051808215151515815260200191505060405180910390f35b341561032457600080fd5b6103bb600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061094a565b604051808215151515815260200191505060405180910390f35b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154905085565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905088565b600060a0604051908101604052808773ffffffffffffffffffffffffffffffffffffffff16815260200186815260200185815260200184815260200183815250600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201556060820151816003015560808201518160040155905050600280548060010182816105d89190610bee565b9160005260206000209001600088909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561081f576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663da89638287878787876040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200184815260200183815260200182815260200195505050505050600060405180830381600087803b151561080a57600080fd5b6102c65a03f1151561081b57600080fd5b5050505b7f2bdcfe8371fe6f6a47ea4c6aa3ea43822faf74e157c1c2b818bd2c45b9931cb68686868686604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a16001905095945050505050565b6002818154811015156108be57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000015411156109425760019050610947565b600090505b90565b6000808911151561095a57600080fd5b610100604051908101604052808a81526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f1e5f1ae2728ee198908fa3eb2f1648d868c071c290c230709b701c79f58d893e89898989898989604051808881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390a16001905098975050505050505050565b815481835581811511610c1557818360005260206000209182019101610c149190610c1a565b5b505050565b610c3c91905b80821115610c38576000816000905550600101610c20565b5090565b905600a165627a7a723058209c5f311a51f5119932f723819a81f6774cf17e1707d047c2f4ee96166d7555390029`,
      gas: `4700000`,
    }, (_error, _contract) => {
      if (_error) {
        _callback(_error, null);
      } else {
        self.web3.eth.getTransactionReceipt(_contract.transactionHash, (_innerError, _result) => {
          if (_innerError) {
            console.log(`Error: ${_error}`);
            _callback(_innerError, null);
          } else {
            self.config.setRelativeContractAddress(_result.contractAddress);
            self.config.save();
            _callback(null, _result.contractAddress);
          }
        });
      }
    });
  }
};

XYO.CLIENT.prototype.sendUncalibratedQuery = function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
  _callback,
) {
  console.log(`sendUncalibratedQuery`);
  this.checkAddress(_address);
  const address = _address;
  const bounty = Number.isNaN(parseInt(_bounty, 10)) ? 1 : parseInt(_bounty, 10);
  const epoch = Number.isNaN(parseInt(_epoch, 10)) ? (new Date()).getTime() : parseInt(_epoch, 10);
  const accuracy = Number.isNaN(parseInt(_accuracy, 10)) ? 1 : parseInt(_accuracy, 10);
  const certainty = Number.isNaN(parseInt(_certainty, 10)) ? 1 : parseInt(_certainty, 10);
  const delay = Number.isNaN(parseInt(_delay, 10)) ? 0 : parseInt(_delay, 10);

  const nowEpoch = (new Date()).getTime();
  if (!(address) || address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (bounty < 1) {
    this.throwError(`Bounty is too low (minimum 1)`);
  } else if (nowEpoch < epoch) {
    this.throwError(`Please specify a time in the past (${nowEpoch}`);
  } else if (accuracy <= 0) {
    this.throwError(`Accuracy must be a positive number: ${accuracy}`);
  } else if (certainty <= 0) {
    this.throwError(`Certainty must be a positive number`);
  } else if (delay < 0) {
    this.throwError(`Answer Delay must be a positive number`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getUncalibratedContract();
  const xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
  const notifyAddress = 0;
  xyInstance.publishQuery(
    bounty,
    address,
    accuracy,
    certainty,
    delay,
    epoch,
    notifyAddress,
    (_error, _result) => {
      if (_error) {
        if (_callback) {
          _callback(_error, null);
        }
        console.log(`Error: ${_error}`);
      } else {
        if (_callback) {
          _callback(null, _result);
        }
        console.log(`Success: ${_result}`);
      }
    },
  );
};

XYO.CLIENT.prototype.sendCalibratedQuery = function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
  _callibrationAddress,
  _callibrationLatitude,
  _callibrationLongitude,
  _callibrationAltitude,
  _callback,
) {
  console.log(`sendCalibratedQuery`);
  this.checkAddress(_address);
  this.checkAddress(_callibrationAddress);
  const address = _address;
  const bounty = Number.isNaN(parseInt(_bounty, 10)) ? 1 : parseInt(_bounty, 10);
  const epoch = Number.isNaN(parseInt(_epoch, 10)) ? (new Date()).getTime() : parseInt(_epoch, 10);
  const accuracy = Number.isNaN(parseInt(_accuracy, 10)) ? 1 : parseInt(_accuracy, 10);
  const certainty = Number.isNaN(parseInt(_certainty, 10)) ? 1 : parseInt(_certainty, 10);
  const delay = Number.isNaN(parseInt(_delay, 10)) ? 0 : parseInt(_delay, 10);

  const nowEpoch = (new Date()).getTime();
  if (!(address) || address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (bounty < 1) {
    this.throwError(`Bounty is too low (minimum 1)`);
  } else if (nowEpoch < epoch) {
    this.throwError(`Please specify a time in the past (${epoch})`);
  } else if (accuracy <= 0) {
    this.throwError(`Accuracy must be a positive number: ${accuracy}`);
  } else if (certainty <= 0) {
    this.throwError(`Certainty must be a positive number`);
  } else if (_callibrationLatitude < -90 || _callibrationLatitude > 90) {
    this.throwError(`Calibration Latitude is out of range (-90 to 90)`);
  } else if (_callibrationLongitude < -180 || _callibrationLatitude > 180) {
    this.throwError(`Calibration Latitude is out of range (-180 to 180)`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
  const notifyAddress = 0;
  xyInstance.publishQuery(
    bounty,
    address,
    accuracy,
    certainty,
    delay,
    epoch,
    _callibrationAddress,
    _callibrationLatitude,
    _callibrationLongitude,
    _callibrationAltitude,
    notifyAddress,
    (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`);
      } else {
        console.log(`Success: ${_result}`);
      }
      if (_callback) {
        _callback(_error, _result);
      }
    },
  );
};

XYO.CLIENT.prototype.sendFencedQuery = function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
  _callback,
) {
  console.log(`sendFencedQuery`);
  this.checkAddress(_address);
  const address = _address;
  const bounty = Number.isNaN(parseInt(_bounty, 10)) ? 1 : Number.parseInt(_bounty, 10);
  const epoch = Number.isNaN(parseInt(_epoch, 10)) ? (new Date()).getTime() : Number.parseInt(_epoch, 10);
  const accuracy = Number.isNaN(parseInt(_accuracy, 10)) ? 1 : Number.parseInt(_accuracy, 10);
  const certainty = Number.isNaN(parseInt(_certainty, 10)) ? 1 : Number.parseInt(_certainty, 10);
  const delay = Number.isNaN(parseInt(_delay, 10)) ? 0 : Number.parseInt(_delay, 10);

  const nowEpoch = (new Date()).getTime();
  if (!(address) || address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (bounty < 1) {
    this.throwError(`Bounty is too low (minimum 1)`);
  } else if (nowEpoch < epoch) {
    this.throwError(`Please specify a time in the past (${nowEpoch})`);
  } else if (accuracy <= 0) {
    this.throwError(`Accuracy must be a positive number: ${accuracy}`);
  } else if (certainty <= 0) {
    this.throwError(`Certainty must be a positive number`);
  } else if (delay < 0) {
    this.throwError(`Answer Delay must be a positive number`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
  const notifyAddress = 0;
  xyInstance.publishQuery(
    bounty,
    address,
    accuracy,
    certainty,
    delay,
    epoch,
    notifyAddress,
    (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`);
      } else {
        console.log(`Success: ${_result}`);
      }
      if (_callback) {
        _callback(_error, _result);
      }
    },
  );
};

XYO.CLIENT.prototype.sendRelativeQuery = function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
  _relativeAddress,
  _notify,
  _callback,
) {
  console.log(`sendRelativeQuery`);
  this.checkAddress(_address);
  this.checkAddress(_relativeAddress);

  const address = _address;
  const bounty = Number.isNaN(parseInt(_bounty, 10)) ? 1 : parseInt(_bounty, 10);
  const epoch = Number.isNaN(parseInt(_epoch, 10)) ? (new Date()).getTime() : parseInt(_epoch, 10);
  const accuracy = Number.isNaN(parseInt(_accuracy, 10)) ? 1 : parseInt(_accuracy, 10);
  const certainty = Number.isNaN(parseInt(_certainty, 10)) ? 1 : parseInt(_certainty, 10);
  const answerDelay = Number.isNaN(parseInt(_delay, 10)) ? 0 : parseInt(_delay, 10);

  const nowEpoch = (new Date()).getTime();
  if (!(address) || address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (bounty < 1) {
    this.throwError(`Bounty is too low (minimum 1)`);
  } else if (nowEpoch < epoch) {
    this.throwError(`Please specify a time in the past (${nowEpoch})`);
  } else if (accuracy <= 0) {
    this.throwError(`Accuracy must be a positive number: ${accuracy}`);
  } else if (certainty <= 0) {
    this.throwError(`Certainty must be a positive number`);
  } else if (answerDelay < 0) {
    this.throwError(`Answer Delay must be a positive number`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getRelativeContract();
  const xyInstance = xyContract.at(this.config.getRelativeContractAddress());
  const notifyAddress = 0;

  xyInstance.publishQuery(
    bounty,
    address,
    accuracy,
    certainty,
    answerDelay,
    epoch,
    address,
    notifyAddress,
    (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`);
      } else {
        console.log(`Success: ${_result}`);
      }
      if (_callback) {
        _callback(_error, _result);
      }
    },
  );
};


XYO.CLIENT.prototype.sendUncalibratedAnswer = function (_address, _latitude, _longitude, _altitude, _accuracy, _certainty, _callback) {
  console.log(`sendUncalibratedAnswer`);
  this.checkAddress(_address);
  if (!(_address) || _address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (_latitude < -90 || _latitude > 90) {
    this.throwError(`Latitude is out of range (-90 to 90)`);
  } else if (_longitude < -180 || _longitude > 180) {
    this.throwError(`Latitude is out of range (-180 to 180)`);
  } else if (_accuracy < 0 || _accuracy > 100) {
    this.throwError(`Accuracy is out of range (0 to 100)`);
  } else if (_certainty < 0 || _certainty > 100) {
    this.throwError(`Certainty is out of range (0 to 100)`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getUncalibratedContract();
  const xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
  xyInstance.publishAnswer(
    _address,
    this.toBigInt(_latitude),
    this.toBigInt(_longitude),
    this.toBigInt(_altitude),
    _accuracy,
    _certainty,
    (new Date()).getTime(), (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`);
      } else {
        console.log(`Success: ${_result}`);
      }
      if (_callback) {
        _callback(_error, _result);
      }
    },
  );
};

XYO.CLIENT.prototype.sendCalibratedAnswer = function (
  _address,
  _latitude,
  _longitude,
  _altitude,
  _accuracy,
  _certainty,
  _callback,
) {
  console.log(`sendCalibratedAnswer`);
  this.checkAddress(_address);
  if (!(_address) || _address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (_latitude < -90 || _latitude > 90) {
    this.throwError(`Latitude is out of range (-90 to 90)`);
  } else if (_longitude < -180 || _longitude > 180) {
    this.throwError(`Latitude is out of range (-180 to 180)`);
  } else if (_accuracy < 0 || _accuracy > 100) {
    this.throwError(`Accuracy is out of range (0 to 100)`);
  } else if (_certainty < 0 || _certainty > 100) {
    this.throwError(`Certainty is out of range (0 to 100)`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
  xyInstance.publishAnswer(
    _address,
    this.toBigInt(_latitude),
    this.toBigInt(_longitude),
    this.toBigInt(_altitude),
    _accuracy,
    _certainty,
    (new Date()).getTime(), (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`);
      } else {
        console.log(`Success: ${_result}`);
      }
      if (_callback) {
        _callback(_error, _result);
      }
    },
  );
};

XYO.CLIENT.prototype.sendRelativeAnswer = function (_address, _range, _accuracy, _certainty, _callback) {
  console.log(`sendRelativeAnswer`);
  this.checkAddress(_address);
  if (!(_address) || _address.length === 0) {
    this.throwError(`Please specify a target XYO address`);
  } else if (_accuracy < 0 || _accuracy > 100) {
    this.throwError(`Accuracy is out of range (0 to 100)`);
  } else if (_certainty < 0 || _certainty > 100) {
    this.throwError(`Certainty is out of range (0 to 100)`);
  } else if (!this.web3) {
    this.throwError(`Wallet not detected.  Please install Meta Mask.`);
  }

  const xyContract = this.getRelativeContract();
  const xyInstance = xyContract.at(this.config.getRelativeContractAddress());
  xyInstance.publishAnswer(_address, this.toBigInt(_range), _accuracy, _certainty, (new Date()).getTime(), (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
    } else {
      console.log(`Success: ${_result}`);
    }
    if (_callback) {
      _callback(_error, _result);
    }
  });
};

XYO.CLIENT.prototype.getPendingUncalibratedQueries = function (_callback) {
  const xyContract = this.getUncalibratedContract();
  const xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
  xyInstance.pendingQueries(this.web3.eth.defaultAccount, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      if (_callback) {
        _callback(_error, null);
      }
    } else {
      console.log(`Success: ${JSON.stringify(XYO.UNCALIBRATEDQUERY.fromArray(_result))}`);
      if (_callback) {
        _callback(null, XYO.UNCALIBRATEDQUERY.fromArray(_result));
      }
    }
  });
};

XYO.CLIENT.prototype.getPendingCalibratedQueries = function (_callback) {
  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
  xyInstance.pendingQueries(this.web3.eth.defaultAccount, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);

      _callback(_error, null);
    } else {
      console.log(`Success: ${JSON.stringify(XYO.CALIBRATEDQUERY.fromArray(_result))}`);
      _callback(null, XYO.CALIBRATEDQUERY.fromArray(_result));
    }
  });
};

XYO.CLIENT.prototype.getPendingRelativeQueries = function (_callback) {
  const xyContract = this.getRelativeContract();
  const xyInstance = xyContract.at(this.config.getRelativeContractAddress());
  xyInstance.pendingQueries(this.web3.eth.defaultAccount, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      if (_callback) {
        _callback(_error, null);
      }
    } else {
      console.log(`Success: ${JSON.stringify(_result)}`);
      console.log(`Success: ${JSON.stringify(XYO.RELATIVEQUERY.fromArray(_result))}`);
      if (_callback) {
        _callback(null, XYO.RELATIVEQUERY.fromArray(_result));
      }
    }
  });
};

XYO.CLIENT.prototype.getCompleteUncalibratedQueryAddress = function (_index, _callback) {
  const xyContract = this.getUncalibratedContract();
  const xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());

  xyInstance.answerList(_index, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
    } else {
      console.log(`Success: ${_result}`);
    }
    if (_callback) {
      _callback(_error, _result);
    }
  });
};

XYO.CLIENT.prototype.getCompleteCalibratedQueryAddress = function (_index, _callback) {
  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());

  xyInstance.answerList(_index, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
    } else {
      console.log(`Success: ${_result}`);
    }
    if (_callback) {
      _callback(_error, _result);
    }
  });
};

XYO.CLIENT.prototype.getCompleteRelativeQueryAddress = function (_index, _callback) {
  const xyContract = this.getRelativeContract();
  const xyInstance = xyContract.at(this.config.getRelativeContractAddress());

  xyInstance.answerList(_index, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
    } else {
      console.log(`Success: ${_result}`);
    }
    if (_callback) {
      _callback(_error, _result);
    }
  });
};

XYO.CLIENT.prototype.getCompleteUncalibratedQuery = function (_address, _callback) {
  this.checkAddress(_address);
  const xyContract = this.getUncalibratedContract();
  const xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
  xyInstance.answeredQueries(_address, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      if (_callback) {
        _callback(_error, null);
      }
    } else {
      console.log(`Success: ${JSON.stringify(XYO.UNCALIBRATEDANSWER.fromArray(_result))}`);
      if (_callback) {
        _callback(null, XYO.UNCALIBRATEDANSWER.fromArray(_result));
      }
    }
  });
};

XYO.CLIENT.prototype.getCompleteCalibratedQuery = function (_address, _callback) {
  this.checkAddress(_address);
  const xyContract = this.getCalibratedContract();
  const xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
  xyInstance.answeredQueries(_address, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      if (_callback) {
        _callback(_error, null);
      }
    } else {
      console.log(`Success: ${JSON.stringify(XYO.CALIBRATEDANSWER.fromArray(_result))}`);
      if (_callback) {
        _callback(null, XYO.CALIBRATEDANSWER.fromArray(_result));
      }
    }
  });
};

XYO.CLIENT.prototype.getCompleteRelativeQuery = function (_address, _callback) {
  this.checkAddress(_address);
  const xyContract = this.getRelativeContract();
  const xyInstance = xyContract.at(this.config.getRelativeContractAddress());
  xyInstance.answeredQueries(_address, (_error, _result) => {
    if (_error) {
      console.log(`Error: ${_error}`);
      if (_callback) {
        _callback(_error, null);
      }
    } else {
      console.log(`Success: ${JSON.stringify(XYO.RELATIVEANSWER.fromArray(_result))}`);
      if (_callback) {
        _callback(null, XYO.RELATIVEANSWER.fromArray(_result));
      }
    }
  });
};

XYO.UNCALIBRATEDQUERY = XYO.UNCALIBRATEDQUERY || function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
) {
  this.checkAddress(_address);
  this.bounty = _bounty;
  this.address = _address;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.delay = _delay;
  this.epoch = _epoch;
};

XYO.UNCALIBRATEDQUERY.prototype = new XYO.BASE();
XYO.UNCALIBRATEDQUERY.constructor = XYO.UNCALIBRATEDQUERY;

XYO.UNCALIBRATEDQUERY.fromArray = function (_array) {
  return new XYO.UNCALIBRATEDQUERY(_array[0], _array[1], _array[2], _array[3], _array[4], _array[5]);
};

XYO.UNCALIBRATEDQUERY.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.UNCALIBRATEDQUERY.prototype.toString = function () {
  return `XYO.UNCALIBRATEDQUERY: Bounty=${this.bounty
  } Address=${this.address
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Delay=${this.delay
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago]`;
};

XYO.CALIBRATEDQUERY = XYO.CALIBRATEDQUERY || function (
  _bounty,
  _address,
  _accuracy,
  _certainty,
  _delay,
  _epoch,
  _calibrationAddress,
  _calibrationLatitude,
  _calibrationLongitude,
  _calibrationAltitude,
) {
  this.checkAddress(_address);
  this.checkAddress(_calibrationAddress);
  this.bounty = _bounty;
  this.address = _address;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.delay = _delay;
  this.epoch = _epoch;
  this.calibrationAddress = _calibrationAddress;
  this.calibrationLatitude = _calibrationLatitude;
  this.calibrationLongitude = _calibrationLongitude;
  this.calibrationAltitude = _calibrationAltitude;
};

XYO.CALIBRATEDQUERY.prototype = new XYO.BASE();
XYO.CALIBRATEDQUERY.constructor = XYO.CALIBRATEDQUERY;

XYO.CALIBRATEDQUERY.fromArray = function (_array) {
  return new XYO.CALIBRATEDQUERY(_array[0], _array[1], _array[2], _array[3], _array[4], _array[5], _array[6], _array[7], _array[8], _array[9]);
};

XYO.CALIBRATEDQUERY.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.CALIBRATEDQUERY.prototype.toString = function () {
  return `XYO.CALIBRATEDQUERY: Bounty=${this.bounty
  } Address=${this.address
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Delay=${this.delay
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago] Calibration Address=${this.calibrationAddress
  } Calibration Latitude=${this.calibrationLatitude
  } Calibration Longitude=${this.calibrationLongitude
  } Calibration Altitude=${this.calibrationAltitude}`;
};

XYO.RELATIVEQUERY = XYO.RELATIVEQUERY || function (_bounty, _address, _accuracy, _certainty, _delay, _epoch, _relativeAddress) {
  this.checkAddress(_address);
  this.checkAddress(_relativeAddress);
  this.bounty = _bounty;
  this.address = _address;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.delay = _delay;
  this.epoch = _epoch;
  this.relativeAddress = _relativeAddress;
};

XYO.RELATIVEQUERY.prototype = new XYO.BASE();
XYO.RELATIVEQUERY.constructor = XYO.RELATIVEQUERY;

XYO.RELATIVEQUERY.fromArray = function (array) {
  return new XYO.RELATIVEQUERY(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
};

XYO.RELATIVEQUERY.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.RELATIVEQUERY.prototype.toString = function () {
  return `XYO.RELATIVEQUERY: Bounty=${this.bounty
  } Address=${this.address
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Delay=${this.delay
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago] Calibration Address=${this.relative_address}`;
};

XYO.UNCALIBRATEDANSWER = XYO.UNCALIBRATEDANSWER || function (_address, _latitude, _longitude, _altitude, _accuracy, _certainty, _epoch) {
  this.checkAddress(_address);
  this.address = _address;
  this.latitude = _latitude;
  this.longitude = _longitude;
  this.altitude = _altitude;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.epoch = _epoch;
};

XYO.UNCALIBRATEDANSWER.prototype = new XYO.BASE();
XYO.UNCALIBRATEDANSWER.constructor = XYO.UNCALIBRATEDANSWER;

XYO.UNCALIBRATEDANSWER.fromArray = function (_array) {
  return new XYO.UNCALIBRATEDANSWER(_array[0], _array[1], _array[2], _array[3], _array[4], _array[5], _array[6]);
};

XYO.UNCALIBRATEDANSWER.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.UNCALIBRATEDANSWER.prototype.toString = function () {
  return `UNCALIBRATEDANSWER: Address=${this.address
  } Latitude=${this.latitude
  } Longitude=${this.longitude
  } Altitude=${this.altitude
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago]`;
};

XYO.CALIBRATEDANSWER = XYO.CALIBRATEDANSWER || function (
  _address,
  _latitude,
  _longitude,
  _altitude,
  _accuracy,
  _certainty,
  _epoch,
) {
  this.checkAddress(_address);
  this.address = _address;
  this.latitude = _latitude;
  this.longitude = _longitude;
  this.altitude = _altitude;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.epoch = _epoch;
};

XYO.CALIBRATEDANSWER.prototype = new XYO.BASE();
XYO.CALIBRATEDANSWER.constructor = XYO.CALIBRATEDANSWER;

XYO.CALIBRATEDANSWER.fromArray = function (_array) {
  return new XYO.CALIBRATEDANSWER(_array[0], _array[1], _array[2], _array[3], _array[4], _array[5], _array[6]);
};

XYO.CALIBRATEDANSWER.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.CALIBRATEDANSWER.prototype.toString = function () {
  return `CALIBRATEDANSWER: Address=${this.address
  } Latitude=${this.latitude
  } Longitude=${this.longitude
  } Altitude=${this.altitude
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago]`;
};


XYO.RELATIVEANSWER = XYO.RELATIVEANSWER || function (
  _address,
  _range,
  _accuracy,
  _certainty,
  _epoch,
) {
  this.checkAddress(_address);
  this.address = _address;
  this.range = _range;
  this.accuracy = _accuracy;
  this.certainty = _certainty;
  this.epoch = _epoch;
};

XYO.RELATIVEANSWER.prototype = new XYO.BASE();
XYO.RELATIVEANSWER.constructor = XYO.RELATIVEANSWER;

XYO.RELATIVEANSWER.fromArray = function (_array) {
  return new XYO.RELATIVEANSWER(_array[0], _array[1], _array[2], _array[3], _array[4]);
};

XYO.RELATIVEANSWER.prototype.secondsAgo = function () {
  return ((new Date()).getTime() - this.epoch) / 1000;
};

XYO.RELATIVEANSWER.prototype.toString = function () {
  return `RELATIVEANSWER: Address=${this.address
  } Range=${this.range
  } Accuracy=${this.accuracy
  } Certainty=${this.certainty
  } Epoch=${this.epoch
  }[${this.secondsAgo()} seconds ago]`;
};
