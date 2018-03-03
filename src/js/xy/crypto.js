/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: crypto.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, March 3, 2018 3:38 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */



var XY;

(function() {
  'use strict';

  XY = XY || {};

  XY.CRYPTO = XY.CRYPTO || {
    init: function() {
      console.log('XY.CRYPTO Init');
    }
  };

  XY.CRYPTO.BASE = XY.CRYPTO.BASE || function(address) {
    this.address = address;
  };

  XY.CRYPTO.BASE.prototype.toString = function() {
    return 'XY.CRYPTO.BASE: ' + this.address;
  };

  XY.CRYPTO.EXCEPTION = XY.CRYPTO.EXCEPTION || function(type, code, message) {
    this.type = type;
    this.code = code;
    this.message = message;
  }

  XY.CRYPTO.EXCEPTION.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.EXCEPTION.constructor = XY.CRYPTO.EXCEPTION;

  XY.CRYPTO.CONFIG = XY.CRYPTO.CONFIG || function(name) {
    name = name || 'default';
    var loaded = false;
    try {
      var data = localStorage.getItem('xy-crypto-config-' + name);
      var obj = JSON.parse(data);
      if (obj) {
        for (var field in obj) {
          if (obj.hasOwnProperty(field)) {
            console.log('Config Field: ' + field + '=' + obj[field]);
            this[field] = obj[field];
          }
        }
        loaded = true;
      }
    } catch (ex) {
      console.log('Config Load Failed (Clearing): ' + ex);
      this.clear();
    }
    if (!loaded) {
      //set defaults
      this.diviner = 'localhost:24456';
    }
  }

  XY.CRYPTO.CONFIG.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.CONFIG.constructor = XY.CRYPTO.CONFIG;

  XY.CRYPTO.CONFIG.prototype.setDivinerAddress = function(diviner) {
    this.diviner = diviner;
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.getDivinerAddress = function() {
    return this.diviner;
  }

  XY.CRYPTO.CONFIG.prototype.setUncalibratedContractAddress = function(address) {
    this.uncalibratedContractAddress = address;
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.getUncalibratedContractAddress = function() {
    return this.uncalibratedContractAddress;
  }

  XY.CRYPTO.CONFIG.prototype.setCalibratedContractAddress = function(address) {
    this.calibratedContractAddress = address;
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.getCalibratedContractAddress = function() {
    return this.calibratedContractAddress;
  }

  XY.CRYPTO.CONFIG.prototype.setRelativeContractAddress = function(address) {
    this.relativeContractAddress = address;
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.getRelativeContractAddress = function() {
    return this.relativeContractAddress;
  }

  XY.CRYPTO.CONFIG.prototype.clear = function(name) {
    name = name || 'default';
    localStorage.setItem('xy-crypto-config-' + name, '{}');
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.save = function(name) {
    name = name || 'default';
    localStorage.setItem('xy-crypto-config-' + name, JSON.stringify(this));
    return this;
  }

  XY.CRYPTO.CLIENT = XY.CRYPTO.CLIENT || function(onWalletChange) {
    var self = this;
    if (typeof web3 === 'undefined') {
      throw new XY.CRYPTO.EXCEPTION(XY.CRYPTO.CLIENT, 1, 'Web3 Undefined');
    }
    this.web3 = new Web3(web3.currentProvider);
    this.config = new XY.CRYPTO.CONFIG();
    this.etherWallet = null;
    this.onWalletChange = onWalletChange;
    setTimeout(function() {
      self.checkWalletAddress();
    }, 0);
    setInterval(function() {
      self.checkWalletAddress();
    }, 1000);
  };

  XY.CRYPTO.CLIENT.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.CLIENT.constructor = XY.CRYPTO.CLIENT;

  XY.CRYPTO.CLIENT.prototype.checkWalletAddress = function() {
    if (this.etherWallet !== this.web3.eth.accounts[0]) {
      this.etherWallet = this.web3.eth.accounts[0];
      if (this.onWalletChange) {
        this.onWalletChange();
      }
    }
  };

  XY.CRYPTO.CLIENT.prototype.getDAppNetworkName = function(callback) {
    this.web3.version.getNetwork(function(error, netId) {
      switch (netId) {
        case '1':
          callback(null, 'ETH-Main');
          break;
        case '2':
          callback(null, 'ETH-Morden');
          break;
        case '3':
          callback(null, 'ETH-Ropsten');
          break;
        case '4':
          callback(null, 'ETH-Rinkeby');
          break;
        case '42':
          callback(null, 'ETH-Kovan');
          break;
        default:
          callback(null, 'Custom: ' + netId);
          break;
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getXyoNetworkName = function(callback) {
    callback(null, 'XYO-Main');
  };

  XY.CRYPTO.CLIENT.prototype.getDAppBalance = function(callback) {
    var self = this;
    self.web3.eth.getBalance(self.etherWallet, function(error, result) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {
          raw: result,
          cooked: self.web3.fromWei(result, 'ether')
        });
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getXyoBalance = function(callback) {
    var self = this;
    self.web3.eth.call({
      to: '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
      data: '0x70a08231000000000000000000000000' + self.web3.eth.accounts[0].substring(2)
    }, function(error, result) {
      if (error) {
        callback(error, null);
      } else {
        if (result.length < 3) {
          callback(null, 0);
        } else {
          callback(null, {
            raw: result,
            cooked: self.web3.fromWei(result, 'ether')
          });
        }
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getUncalibratedContract = function() {

    return self.web3.eth.contract([{
        "constant": false,
        "inputs": [{
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_latitude",
            "type": "int256"
          },
          {
            "name": "_longitude",
            "type": "int256"
          },
          {
            "name": "_altitude",
            "type": "int256"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          }
        ],
        "name": "publishAnswer",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "answeredQueries",
        "outputs": [{
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "latitude",
            "type": "int256"
          },
          {
            "name": "longitude",
            "type": "int256"
          },
          {
            "name": "altitude",
            "type": "int256"
          },
          {
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "name": "certainty",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_xyoValue",
            "type": "uint256"
          },
          {
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_delay",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          },
          {
            "name": "_xynotify",
            "type": "address"
          }
        ],
        "name": "publishQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "pendingQueries",
        "outputs": [{
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "accuracyThreshold",
            "type": "uint256"
          },
          {
            "name": "certaintyThresold",
            "type": "uint256"
          },
          {
            "name": "minimumDelay",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "xynotify",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "answerList",
        "outputs": [{
          "name": "",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "hasPendingQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "delay",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "QueryReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "latitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "longitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "altitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "AnswerReceived",
        "type": "event"
      }
    ]);
  }

  XY.CRYPTO.CLIENT.prototype.getCalibratedContract = function() {

    return self.web3.eth.contract([{
        "constant": false,
        "inputs": [{
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_latitude",
            "type": "int256"
          },
          {
            "name": "_longitude",
            "type": "int256"
          },
          {
            "name": "_altitude",
            "type": "int256"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          }
        ],
        "name": "publishAnswer",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "answeredQueries",
        "outputs": [{
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "latitude",
            "type": "int256"
          },
          {
            "name": "longitude",
            "type": "int256"
          },
          {
            "name": "altitude",
            "type": "int256"
          },
          {
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "name": "certainty",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "pendingQueries",
        "outputs": [{
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "accuracyThreshold",
            "type": "uint256"
          },
          {
            "name": "certaintyThresold",
            "type": "uint256"
          },
          {
            "name": "minimumDelay",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "calibrationAddress",
            "type": "address"
          },
          {
            "name": "calibrationLatitude",
            "type": "int256"
          },
          {
            "name": "calibrationLongitude",
            "type": "int256"
          },
          {
            "name": "calibrationAltitude",
            "type": "int256"
          },
          {
            "name": "xynotify",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "answerList",
        "outputs": [{
          "name": "",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_xyoValue",
            "type": "uint256"
          },
          {
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_delay",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          },
          {
            "name": "_calibrationAddress",
            "type": "address"
          },
          {
            "name": "_calibrationLatitude",
            "type": "int256"
          },
          {
            "name": "_calibrationLongitude",
            "type": "int256"
          },
          {
            "name": "_calibrationAltitude",
            "type": "int256"
          },
          {
            "name": "_xynotify",
            "type": "address"
          }
        ],
        "name": "publishQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "hasPendingQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "delay",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "calibrationAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "calibrationLatitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "calibrationLongitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "calibrationAltitude",
            "type": "int256"
          }
        ],
        "name": "QueryReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "latitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "longitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "altitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "AnswerReceived",
        "type": "event"
      }
    ]);
  }

  XY.CRYPTO.CLIENT.prototype.getFencedContract = function() {

    return self.web3.eth.contract([{
        "constant": false,
        "inputs": [{
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_latitude",
            "type": "int256"
          },
          {
            "name": "_longitude",
            "type": "int256"
          },
          {
            "name": "_altitude",
            "type": "int256"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          }
        ],
        "name": "publishAnswer",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "answeredQueries",
        "outputs": [{
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "latitude",
            "type": "int256"
          },
          {
            "name": "longitude",
            "type": "int256"
          },
          {
            "name": "altitude",
            "type": "int256"
          },
          {
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "name": "certainty",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_xyoValue",
            "type": "uint256"
          },
          {
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_delay",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          },
          {
            "name": "_xynotify",
            "type": "address"
          }
        ],
        "name": "publishQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "pendingQueries",
        "outputs": [{
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "accuracyThreshold",
            "type": "uint256"
          },
          {
            "name": "certaintyThresold",
            "type": "uint256"
          },
          {
            "name": "minimumDelay",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "xynotify",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "answerList",
        "outputs": [{
          "name": "",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "hasPendingQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "delay",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "QueryReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "latitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "longitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "altitude",
            "type": "int256"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "AnswerReceived",
        "type": "event"
      }
    ]);
  }

  XY.CRYPTO.CLIENT.prototype.getRelativeContract = function() {

    return self.web3.eth.contract([{
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "answeredQueries",
        "outputs": [{
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "range",
            "type": "uint256"
          },
          {
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "name": "certainty",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "pendingQueries",
        "outputs": [{
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "name": "accuracyThreshold",
            "type": "uint256"
          },
          {
            "name": "certaintyThresold",
            "type": "uint256"
          },
          {
            "name": "minimumDelay",
            "type": "uint256"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "relativeAddress",
            "type": "address"
          },
          {
            "name": "xynotify",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_range",
            "type": "uint256"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          }
        ],
        "name": "publishAnswer",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "uint256"
        }],
        "name": "answerList",
        "outputs": [{
          "name": "",
          "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "hasPendingQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "_xyoValue",
            "type": "uint256"
          },
          {
            "name": "_xyoAddress",
            "type": "address"
          },
          {
            "name": "_accuracy",
            "type": "uint256"
          },
          {
            "name": "_certainty",
            "type": "uint256"
          },
          {
            "name": "_delay",
            "type": "uint256"
          },
          {
            "name": "_epoch",
            "type": "uint256"
          },
          {
            "name": "_relativeAddress",
            "type": "address"
          },
          {
            "name": "_xynotify",
            "type": "address"
          }
        ],
        "name": "publishQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoValue",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "delay",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "relativeAddress",
            "type": "address"
          }
        ],
        "name": "QueryReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "xyoAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "range",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "accuracy",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "certainty",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "epoch",
            "type": "uint256"
          }
        ],
        "name": "AnswerReceived",
        "type": "event"
      }
    ]);
  }

  XY.CRYPTO.CLIENT.prototype.initializeUncalibratedContract = function(address, callback) {
    console.log('initializeUncalibratedContract');
    var self = this;
    if (this.config.getUncalibratedContractAddress()) {
      callback(null, this.config.getUncalibratedContractAddress());
      return;
    } else if (address) {
      this.config.setUncalibratedContractAddress(address);
      this.config.save();
      callback(null, address);
    } else {
      var xyContract = this.getUncalibratedContract();
      var xy = xyContract.new({
        from: web3.eth.accounts[0],
        data: '6060604052341561000f57600080fd5b610bc88061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312b749321461007d5780632afe70fd146101045780634540b9a3146101a75780637fc4077e14610244578063c9930ee014610313578063e491650e14610376575b600080fd5b341561008857600080fd5b6100ea600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506103a3565b604051808215151515815260200191505060405180910390f35b341561010f57600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107c1565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34156101b257600080fd5b61022a600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610823565b604051808215151515815260200191505060405180910390f35b341561024f57600080fd5b61027b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a2e565b604051808881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390f35b341561031e57600080fd5b6103346004808035906020019091905050610ab0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561038157600080fd5b610389610aef565b604051808215151515815260200191505060405180910390f35b600060e0604051908101604052808973ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187815260200186815260200185815260200184815260200183815250600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060155905050600280548060010182816104c89190610b4b565b916000526020600020900160008a909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561071f576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371975d61898989898989896040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001828152602001975050505050505050600060405180830381600087803b151561070a57600080fd5b6102c65a03f1151561071b57600080fd5b5050505b7fd9fc59387261346eaef71cb06e6c131973f262bd4f463dd327006a4d0a13fdf388888888888888604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390a160019050979650505050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050154908060060154905087565b6000808811151561083357600080fd5b60e0604051908101604052808981526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f7504dfe211cd7e5a51d6cdcb9245552a436b075780a13f65320a855106648f64888888888888604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390a160019050979650505050505050565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905087565b600281815481101515610abf57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610b435760019050610b48565b600090505b90565b815481835581811511610b7257818360005260206000209182019101610b719190610b77565b5b505050565b610b9991905b80821115610b95576000816000905550600101610b7d565b5090565b905600a165627a7a7230582053ee17a43d483ccbc8f9f104048502f6b2cfcd398e9e14e1463e09086d1ecd630029',
        gas: '4700000'
      }, function(e, contract) {
        if (e) {
          callback(e, null);
        } else {
          self.web3.eth.getTransactionReceipt(contract.transactionHash, function(error, result) {
            if (error) {
              console.log('Error: ' + error);
              callback(e, null);
            } else {
              self.config.setUncalibratedContractAddress(result.contractAddress);
              self.config.save();
              callback(null, result.contractAddress);
            }
          });
        }
      })
    }
  };

  XY.CRYPTO.CLIENT.prototype.initializeCalibratedContract = function(address, callback) {
    console.log('initializeCalibratedContract');
    var self = this;
    if (this.config.getCalibratedContractAddress()) {
      callback(null, this.config.getCalibratedContractAddress());
      return;
    } else if (address) {
      this.config.setCalibratedContractAddress(address);
      this.config.save();
      callback(null, address);
    } else {
      var xyContract = this.getCalibratedContract();
      var xy = xyContract.new({
        from: web3.eth.accounts[0],
        data: '6060604052341561000f57600080fd5b610d698061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312b749321461007d5780632afe70fd146101045780637fc4077e146101a7578063c9930ee0146102be578063dee342c714610321578063e491650e146103f8575b600080fd5b341561008857600080fd5b6100ea600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019091905050610425565b604051808215151515815260200191505060405180910390f35b341561010f57600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610843565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34156101b257600080fd5b6101de600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506108a5565b604051808c81526020018b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018a81526020018981526020018881526020018781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019b50505050505050505050505060405180910390f35b34156102c957600080fd5b6102df600480803590602001909190505061095f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561032c57600080fd5b6103de600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061099e565b604051808215151515815260200191505060405180910390f35b341561040357600080fd5b61040b610c90565b604051808215151515815260200191505060405180910390f35b600060e0604051908101604052808973ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187815260200186815260200185815260200184815260200183815250600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c082015181600601559050506002805480600101828161054a9190610cec565b916000526020600020900160008a909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156107a1576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371975d61898989898989896040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001828152602001975050505050505050600060405180830381600087803b151561078c57600080fd5b6102c65a03f1151561079d57600080fd5b5050505b7fd9fc59387261346eaef71cb06e6c131973f262bd4f463dd327006a4d0a13fdf388888888888888604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390a160019050979650505050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050154908060060154905087565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600701549080600801549080600901549080600a0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508b565b60028181548110151561096e57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000808c1115156109ae57600080fd5b610160604051908101604052808d81526020018c73ffffffffffffffffffffffffffffffffffffffff1681526020018b81526020018a81526020018981526020018881526020018773ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e082015181600701556101008201518160080155610120820151816009015561014082015181600a0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f08cdcff0f6b9d92cc47f724bdc741dad25b6e65d9343143ab70454dac8fc44f08c8c8c8c8c8c8c8c8c8c604051808b81526020018a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018981526020018881526020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281526020019a505050505050505050505060405180910390a1600190509b9a5050505050505050505050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610ce45760019050610ce9565b600090505b90565b815481835581811511610d1357818360005260206000209182019101610d129190610d18565b5b505050565b610d3a91905b80821115610d36576000816000905550600101610d1e565b5090565b905600a165627a7a723058200f64aa42af6d8ff57d153008bfd139a3c87731f4a1712a09dc4076b6407a840c0029',
        gas: '4700000'
      }, function(e, contract) {
        if (e) {
          callback(e, null);
        } else {
          self.web3.eth.getTransactionReceipt(contract.transactionHash, function(error, result) {
            if (error) {
              console.log('Error: ' + error);
              callback(e, null);
            } else {
              self.config.setCalibratedContractAddress(result.contractAddress);
              self.config.save();
              callback(null, result.contractAddress);
            }
          });
        }
      })
    }
  };

  XY.CRYPTO.CLIENT.prototype.initializeRelativeContract = function(address, callback) {
    console.log('initializeRelativeContract');
    var self = this;
    if (this.config.getRelativeContractAddress()) {
      callback(null, this.config.getRelativeContractAddress());
      return;
    } else if (address) {
      this.config.setRelativeContractAddress(address);
      this.config.save();
      callback(null, address);
    } else {
      var xyContract = this.getRelativeContract();
      var xy = xyContract.new({
        from: web3.eth.accounts[0],
        data: '6060604052341561000f57600080fd5b610c6b8061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632afe70fd1461007d5780637fc4077e146101125780638b09220b14610214578063c9930ee014610289578063e491650e146102ec578063f8cd575014610319575b600080fd5b341561008857600080fd5b6100b4600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506103d5565b604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018281526020019550505050505060405180910390f35b341561011d57600080fd5b610149600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061042b565b604051808981526020018873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019850505050505050505060405180910390f35b341561021f57600080fd5b61026f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506104d3565b604051808215151515815260200191505060405180910390f35b341561029457600080fd5b6102aa60048080359060200190919050506108af565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102f757600080fd5b6102ff6108ee565b604051808215151515815260200191505060405180910390f35b341561032457600080fd5b6103bb600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061094a565b604051808215151515815260200191505060405180910390f35b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154905085565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905088565b600060a0604051908101604052808773ffffffffffffffffffffffffffffffffffffffff16815260200186815260200185815260200184815260200183815250600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201556060820151816003015560808201518160040155905050600280548060010182816105d89190610bee565b9160005260206000209001600088909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561081f576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663da89638287878787876040518663ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200184815260200183815260200182815260200195505050505050600060405180830381600087803b151561080a57600080fd5b6102c65a03f1151561081b57600080fd5b5050505b7f2bdcfe8371fe6f6a47ea4c6aa3ea43822faf74e157c1c2b818bd2c45b9931cb68686868686604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a16001905095945050505050565b6002818154811015156108be57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000015411156109425760019050610947565b600090505b90565b6000808911151561095a57600080fd5b610100604051908101604052808a81526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f1e5f1ae2728ee198908fa3eb2f1648d868c071c290c230709b701c79f58d893e89898989898989604051808881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390a16001905098975050505050505050565b815481835581811511610c1557818360005260206000209182019101610c149190610c1a565b5b505050565b610c3c91905b80821115610c38576000816000905550600101610c20565b5090565b905600a165627a7a723058209c5f311a51f5119932f723819a81f6774cf17e1707d047c2f4ee96166d7555390029',
        gas: '4700000'
      }, function(e, contract) {
        if (e) {
          callback(e, null);
        } else {
          self.web3.eth.getTransactionReceipt(contract.transactionHash, function(error, result) {
            if (error) {
              console.log('Error: ' + error);
              callback(e, null);
            } else {
              self.config.setRelativeContractAddress(result.contractAddress);
              self.config.save();
              callback(null, result.contractAddress);
            }
          });
        }
      })
    }
  };

  XY.CRYPTO.CLIENT.prototype.sendUncalibratedQuery = function(bounty, xyoAddress, accuracy, certainty, delay, epoch, callback) {
    console.log("sendUncalibratedQuery");
    var targetAddress = xyoAddress;
    var targetBounty = isNaN(parseInt(bounty)) ? 1 : parseInt(bounty);
    var targetEpoch = isNaN(parseInt(epoch)) == NaN ? (new Date).getTime() : parseInt(epoch);
    var targetAccuracy = isNaN(parseInt(accuracy)) == NaN ? 1 : parseInt(accuracy);
    var targetCertainty = isNaN(parseInt(certainty)) == NaN ? 1 : parseInt(certainty);
    var targetAnswerDelay = isNaN(parseInt(delay)) == NaN ? 0 : parseInt(delay);

    var nowEpoch = (new Date).getTime();
    if (!(targetAddress) || targetAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (targetBounty < 1) {
      throw {
        message: 'Bounty is too low (minimum 1)'
      };
    } else if (nowEpoch < targetEpoch) {
      throw {
        message: 'Please specify a time in the past (' + nowEpoch + ')'
      };
    } else if (targetAccuracy <= 0) {
      throw {
        message: 'Accuracy must be a positive number: ' + accuracy
      };
    } else if (targetCertainty <= 0) {
      throw {
        message: 'Certainty must be a positive number'
      };
    } else if (targetAnswerDelay < 0) {
      throw {
        message: 'Answer Delay must be a positive number'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getUncalibratedContract();
    var xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
    var notifyAddress = 0;
    xyInstance.publishQuery(targetBounty, targetAddress, targetAccuracy, targetCertainty, targetAnswerDelay, targetEpoch, notifyAddress, function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.sendCalibratedQuery = function(bounty, xyoAddress, accuracy, certainty, delay, epoch, callibration_address, callibration_latitude, callibration_longitude, callibration_altitude, callback) {
    console.log("sendCalibratedQuery");
    var targetAddress = xyoAddress;
    var targetBounty = isNaN(parseInt(bounty)) ? 1 : parseInt(bounty);
    var targetEpoch = isNaN(parseInt(epoch)) == NaN ? (new Date).getTime() : parseInt(epoch);
    var targetAccuracy = isNaN(parseInt(accuracy)) == NaN ? 1 : parseInt(accuracy);
    var targetCertainty = isNaN(parseInt(certainty)) == NaN ? 1 : parseInt(certainty);
    var targetAnswerDelay = isNaN(parseInt(delay)) == NaN ? 0 : parseInt(delay);

    var nowEpoch = (new Date).getTime();
    if (!(targetAddress) || targetAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (targetBounty < 1) {
      throw {
        message: 'Bounty is too low (minimum 1)'
      };
    } else if (nowEpoch < targetEpoch) {
      throw {
        message: 'Please specify a time in the past (' + nowEpoch + ')'
      };
    } else if (targetAccuracy <= 0) {
      throw {
        message: 'Accuracy must be a positive number: ' + accuracy
      };
    } else if (targetCertainty <= 0) {
      throw {
        message: 'Certainty must be a positive number'
      };
    } else if (callibration_latitude < -90 || callibration_latitude > 90) {
      throw {
        message: 'Calibration Latitude is out of range (-90 to 90)'
      };
    } else if (callibration_longitude < -180 || callibration_latitude > 180) {
      throw {
        message: 'Calibration Latitude is out of range (-180 to 180)'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
    var notifyAddress = 0;
    xyInstance.publishQuery(
      targetBounty,
      targetAddress,
      targetAccuracy,
      targetCertainty,
      targetAnswerDelay,
      targetEpoch,
      callibration_address,
      callibration_latitude,
      callibration_longitude,
      callibration_altitude,
      notifyAddress,
      function(error, result) {
        if (error) {
          console.log("Error: " + error);
        } else {
          console.log("Success: " + result);
        }
      });
  }

  XY.CRYPTO.CLIENT.prototype.sendFencedQuery = function(bounty, xyoAddress, accuracy, certainty, delay, epoch, callback) {
    console.log("sendFencedQuery");
    var targetAddress = xyoAddress;
    var targetBounty = isNaN(parseInt(bounty)) ? 1 : parseInt(bounty);
    var targetEpoch = isNaN(parseInt(epoch)) == NaN ? (new Date).getTime() : parseInt(epoch);
    var targetAccuracy = isNaN(parseInt(accuracy)) == NaN ? 1 : parseInt(accuracy);
    var targetCertainty = isNaN(parseInt(certainty)) == NaN ? 1 : parseInt(certainty);
    var targetAnswerDelay = isNaN(parseInt(delay)) == NaN ? 0 : parseInt(delay);

    var nowEpoch = (new Date).getTime();
    if (!(targetAddress) || targetAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (targetBounty < 1) {
      throw {
        message: 'Bounty is too low (minimum 1)'
      };
    } else if (nowEpoch < targetEpoch) {
      throw {
        message: 'Please specify a time in the past (' + nowEpoch + ')'
      };
    } else if (targetAccuracy <= 0) {
      throw {
        message: 'Accuracy must be a positive number: ' + accuracy
      };
    } else if (targetCertainty <= 0) {
      throw {
        message: 'Certainty must be a positive number'
      };
    } else if (targetAnswerDelay < 0) {
      throw {
        message: 'Answer Delay must be a positive number'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
    var notifyAddress = 0;
    xyInstance.publishQuery(targetBounty, targetAddress, targetAccuracy, targetCertainty, targetAnswerDelay, targetEpoch, notifyAddress, function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.sendRelativeQuery = function(bounty, xyoAddress, accuracy, certainty, delay, epoch, relativeAddress, notify, callback) {
    console.log("sendRelativeQuery");
    var targetAddress = xyoAddress;
    var targetBounty = isNaN(parseInt(bounty)) ? 1 : parseInt(bounty);
    var targetEpoch = isNaN(parseInt(epoch)) == NaN ? (new Date).getTime() : parseInt(epoch);
    var targetAccuracy = isNaN(parseInt(accuracy)) == NaN ? 1 : parseInt(accuracy);
    var targetCertainty = isNaN(parseInt(certainty)) == NaN ? 1 : parseInt(certainty);
    var targetAnswerDelay = isNaN(parseInt(delay)) == NaN ? 0 : parseInt(delay);
    var targetRelativeAddress = relativeAddress;

    var nowEpoch = (new Date).getTime();
    if (!(targetAddress) || targetAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (targetBounty < 1) {
      throw {
        message: 'Bounty is too low (minimum 1)'
      };
    } else if (nowEpoch < targetEpoch) {
      throw {
        message: 'Please specify a time in the past (' + nowEpoch + ')'
      };
    } else if (targetAccuracy <= 0) {
      throw {
        message: 'Accuracy must be a positive number: ' + accuracy
      };
    } else if (targetCertainty <= 0) {
      throw {
        message: 'Certainty must be a positive number'
      };
    } else if (targetAnswerDelay < 0) {
      throw {
        message: 'Answer Delay must be a positive number'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getRelativeContract();
    var xyInstance = xyContract.at(this.config.getRelativeContractAddress());
    var notifyAddress = 0;

    xyInstance.publishQuery(targetBounty, targetAddress, targetAccuracy, targetCertainty, targetAnswerDelay, targetEpoch, targetRelativeAddress, notifyAddress, function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }


  XY.CRYPTO.CLIENT.prototype.sendUncalibratedAnswer = function(xyoAddress, latitude, longitude, altitude, accuracy, certainty, callback) {
    console.log("sendUncalibratedAnswer");

    var nowEpoch = (new Date).getTime();
    if (!(xyoAddress) || xyoAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (latitude < -90 || latitude > 90) {
      throw {
        message: 'Latitude is out of range (-90 to 90)'
      };
    } else if (longitude < -180 || latitude > 180) {
      throw {
        message: 'Latitude is out of range (-180 to 180)'
      };
    } else if (accuracy < 0 || accuracy > 100) {
      throw {
        message: 'Accuracy is out of range (0 to 100)'
      };
    } else if (certainty < 0 || certainty > 100) {
      throw {
        message: 'Certainty is out of range (0 to 100)'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getUncalibratedContract();
    var xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
    xyInstance.publishAnswer(xyoAddress, latitude.toString().replace('.', ''), longitude.toString().replace('.', ''), altitude.toString().replace('.', ''), accuracy, certainty, (new Date).getTime(), function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.sendCalibratedAnswer = function(xyoAddress, latitude, longitude, altitude, accuracy, certainty, callback) {
    console.log("sendCalibratedAnswer");

    var nowEpoch = (new Date).getTime();
    if (!(xyoAddress) || xyoAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (latitude < -90 || latitude > 90) {
      throw {
        message: 'Latitude is out of range (-90 to 90)'
      };
    } else if (longitude < -180 || latitude > 180) {
      throw {
        message: 'Latitude is out of range (-180 to 180)'
      };
    } else if (accuracy < 0 || accuracy > 100) {
      throw {
        message: 'Accuracy is out of range (0 to 100)'
      };
    } else if (certainty < 0 || certainty > 100) {
      throw {
        message: 'Certainty is out of range (0 to 100)'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
    xyInstance.publishAnswer(xyoAddress, latitude.toString().replace('.', ''), longitude.toString().replace('.', ''), altitude.toString().replace('.', ''), accuracy, certainty, (new Date).getTime(), function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.sendRelativeAnswer = function(xyoAddress, range, accuracy, certainty, callback) {
    console.log("sendRelativeAnswer");

    var nowEpoch = (new Date).getTime();
    if (!(xyoAddress) || xyoAddress.length == 0) {
      throw {
        message: 'Please specify a target XYO address'
      };
    } else if (accuracy < 0 || accuracy > 100) {
      throw {
        message: 'Accuracy is out of range (0 to 100)'
      };
    } else if (certainty < 0 || certainty > 100) {
      throw {
        message: 'Certainty is out of range (0 to 100)'
      };
    } else if (!this.web3) {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }

    var xyContract = this.getRelativeContract();
    var xyInstance = xyContract.at(this.config.getRelativeContractAddress());
    xyInstance.publishAnswer(xyoAddress, range.toString().replace('.', ''), accuracy, certainty, (new Date).getTime(), function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getPendingUncalibratedQueries = function(callback) {
    var xyContract = this.getUncalibratedContract();
    var xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
    xyInstance.pendingQueries(this.web3.eth.defaultAccount, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.UNCALIBRATEDQUERY.fromArray(result)));
        callback(null, XY.CRYPTO.UNCALIBRATEDQUERY.fromArray(result));
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getPendingCalibratedQueries = function(callback) {
    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
    xyInstance.pendingQueries(this.web3.eth.defaultAccount, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.CALIBRATEDQUERY.fromArray(result)));
        callback(null, XY.CRYPTO.CALIBRATEDQUERY.fromArray(result));
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getPendingRelativeQueries = function(callback) {
    var xyContract = this.getRelativeContract();
    var xyInstance = xyContract.at(this.config.getRelativeContractAddress());
    xyInstance.pendingQueries(this.web3.eth.defaultAccount, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(result));
        console.log("Success: " + JSON.stringify(XY.CRYPTO.RELATIVEQUERY.fromArray(result)));
        callback(null, XY.CRYPTO.RELATIVEQUERY.fromArray(result));
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteUncalibratedQueryAddress = function(index, callback) {
    var xyContract = this.getUncalibratedContract();
    var xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());

    window.arie = xyInstance.answerList(index, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + result);
        callback(null, result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteCalibratedQueryAddress = function(index, callback) {
    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());

    window.arie = xyInstance.answerList(index, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + result);
        callback(null, result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteRelativeQueryAddress = function(index, callback) {
    var xyContract = this.getRelativeContract();
    var xyInstance = xyContract.at(this.config.getRelativeContractAddress());

    window.arie = xyInstance.answerList(index, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + result);
        callback(null, result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteUncalibratedQuery = function(address, callback) {
    var xyContract = this.getUncalibratedContract();
    var xyInstance = xyContract.at(this.config.getUncalibratedContractAddress());
    xyInstance.answeredQueries(address, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.UNCALIBRATEDANSWER.fromArray(result)));
        callback(null, XY.CRYPTO.UNCALIBRATEDANSWER.fromArray(result));
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteCalibratedQuery = function(address, callback) {
    var xyContract = this.getCalibratedContract();
    var xyInstance = xyContract.at(this.config.getCalibratedContractAddress());
    xyInstance.answeredQueries(address, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.CALIBRATEDANSWER.fromArray(result)));
        callback(null, XY.CRYPTO.CALIBRATEDANSWER.fromArray(result));
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getCompleteRelativeQuery = function(address, callback) {
    var xyContract = this.getRelativeContract();
    var xyInstance = xyContract.at(this.config.getRelativeContractAddress());
    xyInstance.answeredQueries(address, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.RELATIVEANSWER.fromArray(result)));
        callback(null, XY.CRYPTO.RELATIVEANSWER.fromArray(result));
      }
    });
  }

  XY.CRYPTO.UNCALIBRATEDQUERY = XY.CRYPTO.UNCALIBRATEDQUERY || function(bounty, address, accuracy, certainty, delay, epoch) {
    this.bounty = bounty;
    this.address = address;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.delay = delay;
    this.epoch = epoch;
  };

  XY.CRYPTO.UNCALIBRATEDQUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.UNCALIBRATEDQUERY.constructor = XY.CRYPTO.UNCALIBRATEDQUERY;

  XY.CRYPTO.UNCALIBRATEDQUERY.fromArray = function(array) {
    return new XY.CRYPTO.UNCALIBRATEDQUERY(array[0], array[1], array[2], array[3], array[4], array[5]);
  }

  XY.CRYPTO.UNCALIBRATEDQUERY.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.UNCALIBRATEDQUERY.prototype.toString = function() {
    return 'XY.CRYPTO.UNCALIBRATEDQUERY: Bounty=' + this.bounty +
      ' Address=' + this.address +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Delay=' + this.delay +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };

  XY.CRYPTO.CALIBRATEDQUERY = XY.CRYPTO.CALIBRATEDQUERY || function(bounty, address, accuracy, certainty, delay, epoch, calibration_address, calibration_latitude, calibration_longitude, calibration_altitude) {
    this.bounty = bounty;
    this.address = address;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.delay = delay;
    this.epoch = epoch;
    this.calibration_address = calibration_address;
    this.calibration_latitude = calibration_latitude;
    this.calibration_longitude = calibration_longitude;
    this.calibration_altitude = calibration_altitude;
  };

  XY.CRYPTO.CALIBRATEDQUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.CALIBRATEDQUERY.constructor = XY.CRYPTO.CALIBRATEDQUERY;

  XY.CRYPTO.CALIBRATEDQUERY.fromArray = function(array) {
    return new XY.CRYPTO.CALIBRATEDQUERY(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9]);
  }

  XY.CRYPTO.CALIBRATEDQUERY.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.CALIBRATEDQUERY.prototype.toString = function() {
    return 'XY.CRYPTO.CALIBRATEDQUERY: Bounty=' + this.bounty +
      ' Address=' + this.address +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Delay=' + this.delay +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]' +
      ' Calibration Address=' + this.calibration_address +
      ' Calibration Latitude=' + this.calibration_latitude +
      ' Calibration Longitude=' + this.calibration_longitude +
      ' Calibration Altitude=' + this.calibration_altitude;
  };

  XY.CRYPTO.RELATIVEQUERY = XY.CRYPTO.RELATIVEQUERY || function(bounty, address, accuracy, certainty, delay, epoch, relative_address) {
    this.bounty = bounty;
    this.address = address;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.delay = delay;
    this.epoch = epoch;
    this.relative_address = relative_address;
  };

  XY.CRYPTO.RELATIVEQUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.RELATIVEQUERY.constructor = XY.CRYPTO.RELATIVEQUERY;

  XY.CRYPTO.RELATIVEQUERY.fromArray = function(array) {
    return new XY.CRYPTO.RELATIVEQUERY(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
  }

  XY.CRYPTO.RELATIVEQUERY.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.RELATIVEQUERY.prototype.toString = function() {
    return 'XY.CRYPTO.RELATIVEQUERY: Bounty=' + this.bounty +
      ' Address=' + this.address +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Delay=' + this.delay +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]',
      ' Calibration Address=' + this.relative_address;
  };

  XY.CRYPTO.UNCALIBRATEDANSWER = XY.CRYPTO.UNCALIBRATEDANSWER || function(address, latitude, longitude, altitude, accuracy, certainty, epoch) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.epoch = epoch;
  };

  XY.CRYPTO.UNCALIBRATEDANSWER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.UNCALIBRATEDANSWER.constructor = XY.CRYPTO.UNCALIBRATEDANSWER;

  XY.CRYPTO.UNCALIBRATEDANSWER.fromArray = function(array) {
    return new XY.CRYPTO.UNCALIBRATEDANSWER(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
  }

  XY.CRYPTO.UNCALIBRATEDANSWER.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.UNCALIBRATEDANSWER.prototype.toString = function() {
    return 'UNCALIBRATEDANSWER: Address=' + this.address +
      ' Latitude=' + this.latitude +
      ' Longitude=' + this.longitude +
      ' Altitude=' + this.altitude +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };

  XY.CRYPTO.CALIBRATEDANSWER = XY.CRYPTO.CALIBRATEDANSWER || function(address, latitude, longitude, altitude, accuracy, certainty, epoch) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.epoch = epoch;
  };

  XY.CRYPTO.CALIBRATEDANSWER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.CALIBRATEDANSWER.constructor = XY.CRYPTO.CALIBRATEDANSWER;

  XY.CRYPTO.CALIBRATEDANSWER.fromArray = function(array) {
    return new XY.CRYPTO.CALIBRATEDANSWER(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
  }

  XY.CRYPTO.CALIBRATEDANSWER.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.CALIBRATEDANSWER.prototype.toString = function() {
    return 'CALIBRATEDANSWER: Address=' + this.address +
      ' Latitude=' + this.latitude +
      ' Longitude=' + this.longitude +
      ' Altitude=' + this.altitude +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };


  XY.CRYPTO.RELATIVEANSWER = XY.CRYPTO.RELATIVEANSWER || function(address, range, accuracy, certainty, epoch) {
    this.address = address;
    this.range = range;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.epoch = epoch;
  };

  XY.CRYPTO.RELATIVEANSWER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.RELATIVEANSWER.constructor = XY.CRYPTO.RELATIVEANSWER;

  XY.CRYPTO.RELATIVEANSWER.fromArray = function(array) {
    return new XY.CRYPTO.RELATIVEANSWER(array[0], array[1], array[2], array[3], array[4]);
  }

  XY.CRYPTO.RELATIVEANSWER.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.RELATIVEANSWER.prototype.toString = function() {
    return 'RELATIVEANSWER: Address=' + this.address +
      ' Range=' + this.range +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };

  $(document).ready(function() {
    XY.CRYPTO.init();
  });

}());
