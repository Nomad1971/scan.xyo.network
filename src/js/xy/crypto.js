/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: crypto.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 2, 2018 10:12 AM
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

  XY.CRYPTO.CONFIG.prototype.setXYEthContractAddress = function(address) {
    this.xyEthContract = address;
    return this;
  }

  XY.CRYPTO.CONFIG.prototype.getXYEthContractAddress = function() {
    return this.xyEthContract;
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

  XY.CRYPTO.CLIENT.prototype.initializeEthNetwork = function(address, callback) {
    console.log('initializeEthNetwork');
    var self = this;
    if (this.config.getXYEthContractAddress()) {
      callback(null, this.config.getXYEthContractAddress());
      return;
    } else if (address) {
      this.config.setXYEthContractAddress(address);
      this.config.save();
      callback(null, address);
    } else {
      var xyContract = self.web3.eth.contract([{
        'constant': true,
        'inputs': [],
        'name': 'receiveQuery',
        'outputs': [{
          'name': '',
          'type': 'bool'
        }],
        'payable': false,
        'stateMutability': 'pure',
        'type': 'function'
      }, {
        'constant': false,
        'inputs': [{
          'name': '_xyoValue',
          'type': 'uint256'
        }, {
          'name': '_xyoAddress',
          'type': 'address'
        }, {
          'name': '_accuracy',
          'type': 'uint256'
        }, {
          'name': '_certainty',
          'type': 'uint256'
        }, {
          'name': '_delay',
          'type': 'uint256'
        }, {
          'name': '_epoch',
          'type': 'uint256'
        }],
        'name': 'publishQuery',
        'outputs': [{
          'name': '',
          'type': 'bool'
        }],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      }, {
        'constant': true,
        'inputs': [],
        'name': 'hasPendingQuery',
        'outputs': [{
          'name': '',
          'type': 'bool'
        }],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'name': 'xyoValue',
          'type': 'uint256'
        }, {
          'indexed': false,
          'name': 'xyoAddress',
          'type': 'address'
        }, {
          'indexed': false,
          'name': 'accuracy',
          'type': 'uint256'
        }, {
          'indexed': false,
          'name': 'certainty',
          'type': 'uint256'
        }, {
          'indexed': false,
          'name': 'delay',
          'type': 'uint256'
        }, {
          'indexed': false,
          'name': 'epoch',
          'type': 'uint256'
        }],
        'name': 'QueryReceived',
        'type': 'event'
      }, {
        'anonymous': false,
        'inputs': [{
          'indexed': false,
          'name': 'divinerAddress',
          'type': 'address'
        }, {
          'indexed': false,
          'name': 'lat',
          'type': 'string'
        }, {
          'indexed': false,
          'name': 'lng',
          'type': 'string'
        }],
        'name': 'AnswerReceived',
        'type': 'event'
      }]);
      var xy = xyContract.new({
        from: web3.eth.accounts[0],
        data: '0x6060604052341561000f57600080fd5b61036c8061001e6000396000f300606060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634d0e323a1461005c578063990f4c6f14610089578063e491650e14610107575b600080fd5b341561006757600080fd5b61006f610134565b604051808215151515815260200191505060405180910390f35b341561009457600080fd5b6100ed600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061013d565b604051808215151515815260200191505060405180910390f35b341561011257600080fd5b61011a6102e4565b604051808215151515815260200191505060405180910390f35b60006001905090565b6000808711151561014d57600080fd5b7f7504dfe211cd7e5a51d6cdcb9245552a436b075780a13f65320a855106648f64878787878787604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390a160c0604051908101604052808881526020018773ffffffffffffffffffffffffffffffffffffffff168152602001868152602001858152602001848152602001838152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a08201518160050155905050600190509695505050505050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610338576001905061033d565b600090505b905600a165627a7a723058205a713d6916bfadc44a5f5316263cfe7af39a6ae6ea0bda5a9a49d86a73cd192f0029',
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
              self.config.setXYEthContractAddress(result.contractAddress);
              self.config.save();
              callback(null, result.contractAddress);
            }
          });
        }
      })
    }
  };

  XY.CRYPTO.SENTINEL = XY.CRYPTO.SENTINEL || function(address) {
    this.address = address;
    this.ledger = [];
  };

  XY.CRYPTO.SENTINEL.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.SENTINEL.constructor = XY.CRYPTO.SENTINEL;

  XY.CRYPTO.SENTINEL.prototype.toString = function() {
    return 'XY.CRYPTO.SENTINEL: ' + this.address;
  };

  XY.CRYPTO.BRIDGE = XY.CRYPTO.BRIDGE || function(address) {
    this.address = address;
  };

  XY.CRYPTO.BRIDGE.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.BRIDGE.constructor = XY.CRYPTO.BRIDGE;

  XY.CRYPTO.BRIDGE.prototype.toString = function() {
    return 'XY.CRYPTO.BRIDGE: ' + this.address;
  };

  XY.CRYPTO.ARCHIVER = XY.CRYPTO.ARCHIVER || function(address) {
    this.address = address;
  };

  XY.CRYPTO.ARCHIVER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.ARCHIVER.constructor = XY.CRYPTO.ARCHIVER;

  XY.CRYPTO.ARCHIVER.prototype.toString = function() {
    return 'XY.CRYPTO.ARCHIVER: ' + this.address;
  };

  XY.CRYPTO.DIVINER = XY.CRYPTO.DIVINER || function(address) {
    this.address = address;
  };

  XY.CRYPTO.DIVINER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.DIVINER.constructor = XY.CRYPTO.DIVINER;

  XY.CRYPTO.DIVINER.prototype.toString = function() {
    return 'XY.CRYPTO.DIVINER: ' + this.address;
  };

  XY.CRYPTO.DIVINER.prototype.getPending = function(callback) {
    console.log('getPending');
    $.ajax({
      method: 'get',
      contentType: 'application/json',
      url: 'http://' + this.address + '/pending',
      success: function(result) {
        callback(JSON.parse(result));
      }
    });
  };

  XY.CRYPTO.QUERY = XY.CRYPTO.QUERY || function(targetAddress, bounty, epoch, accuracy, certainty, answerDelay, gas) {
    this.targetAddress = targetAddress;
    this.bounty = isNaN(parseInt(bounty)) ? 1 : parseInt(bounty);
    this.epoch = isNaN(parseInt(epoch)) == NaN ? (new Date).getTime() : parseInt(epoch);
    this.accuracy = isNaN(parseInt(accuracy)) == NaN ? 1 : parseInt(accuracy);
    this.certainty = isNaN(parseInt(certainty)) == NaN ? 1 : parseInt(certainty);
    this.answerDelay = isNaN(parseInt(answerDelay)) == NaN ? 0 : parseInt(answerDelay);
    this.gas = isNaN(parseInt(gas)) == NaN ? 20000 : parseInt(gas)

    var nowEpoch = (new Date).getTime();
    if (!(this.targetAddress) || this.targetAddress.length == 0) {
      throw {
        message: 'Please specify a target address'
      };
    } else if (this.bounty < 1) {
      throw {
        message: 'Bounty is too low (minimum 1)'
      };
    } else if (nowEpoch < this.epoch) {
      throw {
        message: 'Please specify a time in the past (' + nowEpoch + ')'
      };
    } else if (this.accuracy <= 0) {
      throw {
        message: 'Accuracy must be a positive number'
      };
    } else if (this.certainty <= 0) {
      throw {
        message: 'Certainty must be a positive number'
      };
    } else if (this.answerDelay < 0) {
      throw {
        message: 'Answer Delay must be a positive number'
      };
    } else if (this.gas < 20000) {
      throw {
        message: 'Ether Gas too low. (Min 20000)'
      };
    } else if (typeof web3 === 'undefined') {
      throw {
        message: 'Wallet not detected.  Please install Meta Mask.'
      };
    }
  };

  XY.CRYPTO.QUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.QUERY.constructor = XY.CRYPTO.QUERY;

  XY.CRYPTO.QUERY.prototype.toString = function() {
    return 'XY.CRYPTO.QUERY: ' + this.targetAddress;
  };

  XY.CRYPTO.QUERY.prototype.send = function() {

    var web3Instance = new Web3(web3.currentProvider);
    web3Instance.eth.defaultAccount = web3.eth.accounts[0];

    var contractDesc = [{
        'constant': true,
        'inputs': [{
          'name': '',
          'type': 'uint256'
        }],
        'name': 'questions',
        'outputs': [{
          'name': '',
          'type': 'address'
        }],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [{
            'name': 'bounty',
            'type': 'uint256'
          },
          {
            'name': 'linkId',
            'type': 'address'
          },
          {
            'name': 'epoch',
            'type': 'uint256'
          },
          {
            'name': 'accuracy',
            'type': 'uint32'
          },
          {
            'name': 'certainty',
            'type': 'uint32'
          },
          {
            'name': 'answerDelay',
            'type': 'uint256'
          }
        ],
        'name': 'ask',
        'outputs': [{
          'name': '',
          'type': 'address'
        }],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      }
    ];

    var AskQuestion = web3Instance.eth.contract(contractDesc);

    var question = AskQuestion.at('0xeD90D4979cEF2f23a593f871C59CA40f4905E547');

    question.ask(
      this.bounty, this.targetAddress, this.epoch, this.accuracy, this.certainty, this.answerDelay, {
        value: 0,
        gas: this.ether
      },
      function(error, result) {
        if (error) {
          alert('Error: ' + error);
        } else {
          alert('Tx: ' + result);
        }
      }
    );
  };

  XY.CRYPTO.QUERY = XY.CRYPTO.QUERY || function(targetAddress, bounty, epoch, accuracy, certainty, answerDelay, gas) {
    this.targetAddress = targetAddress;
    this.bounty = isNaN(parseInt(bounty)) ? -1 : parseInt(bounty);
    this.epoch = isNaN(parseInt(epoch)) == NaN ? -1 : parseInt(epoch);
    this.accuracy = isNaN(parseInt(accuracy)) == NaN ? -1 : parseInt(accuracy);
    this.certainty = isNaN(parseInt(certainty)) == NaN ? -1 : parseInt(certainty);
    this.answerDelay = isNaN(parseInt(answerDelay)) == NaN ? -1 : parseInt(answerDelay);
    this.gas = isNaN(parseInt(gas)) == NaN ? -1 : parseInt(gas)

    var nowEpoch = (new Date).getTime();
    if (!(this.targetAddress) || this.targetAddress.length == 0) {
      throw 'Please specify a target address';
    } else if (this.bounty < 1000) {
      throw 'Bounty is too low (minimum 1000)';
    } else if (nowEpoch < this.epoch) {
      throw 'Please specify a time in the past (' + nowEpoch + ')';
    } else if (this.accuracy <= 0) {
      throw 'Accuracy must be a positive number';
    } else if (this.certainty <= 0) {
      throw 'Certainty must be a positive number';
    } else if (this.answerDelay < 0) {
      throw 'Answer Delay must be a positive number';
    } else if (this.gas < 20000) {
      throw 'Ether Gas too low. (Min 20000)';
    } else if (typeof web3 === 'undefined') {
      throw 'Wallet not detected.  Please install Meta Mask.';
    }
  };

  XY.CRYPTO.QUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.QUERY.constructor = XY.CRYPTO.QUERY;

  XY.CRYPTO.QUERY.prototype.toString = function() {
    return 'XY.CRYPTO.QUERY: ' + this.targetAddress;
  };

  XY.CRYPTO.QUERY.prototype.send = function() {

    var web3Instance = new Web3(web3.currentProvider);
    web3Instance.eth.defaultAccount = web3.eth.accounts[0];

    var contractDesc = [{
        'constant': true,
        'inputs': [{
          'name': '',
          'type': 'uint256'
        }],
        'name': 'questions',
        'outputs': [{
          'name': '',
          'type': 'address'
        }],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [{
            'name': 'bounty',
            'type': 'uint256'
          },
          {
            'name': 'linkId',
            'type': 'address'
          },
          {
            'name': 'epoch',
            'type': 'uint256'
          },
          {
            'name': 'accuracy',
            'type': 'uint32'
          },
          {
            'name': 'certainty',
            'type': 'uint32'
          },
          {
            'name': 'answerDelay',
            'type': 'uint256'
          }
        ],
        'name': 'ask',
        'outputs': [{
          'name': '',
          'type': 'address'
        }],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      }
    ];

    var AskQuestion = web3Instance.eth.contract(contractDesc);

    var question = AskQuestion.at('0xeD90D4979cEF2f23a593f871C59CA40f4905E547');

    question.ask(
      this.bounty, this.targetAddress, this.epoch, this.accuracy, this.certainty, this.answerDelay, {
        value: 0,
        gas: this.ether
      },
      function(error, result) {
        if (error) {
          alert('Error: ' + error);
        } else {
          alert('Tx: ' + result);
        }
      }
    );
  };

  $(document).ready(function() {
    XY.CRYPTO.init();
  });

}());
