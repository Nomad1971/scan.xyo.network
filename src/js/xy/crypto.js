/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: crypto.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 2, 2018 12:10 PM
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

  XY.CRYPTO.CLIENT.prototype.getXYContract = function() {

    return self.web3.eth.contract([{
        "constant": true,
        "inputs": [{
          "name": "",
          "type": "address"
        }],
        "name": "answeredQueries",
        "outputs": [{
            "name": "accuracyScore",
            "type": "string"
          },
          {
            "name": "certaintyScore",
            "type": "string"
          },
          {
            "name": "lat",
            "type": "string"
          },
          {
            "name": "lng",
            "type": "string"
          },
          {
            "name": "alt",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "receiveQuery",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "pure",
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
          }
        ],
        "name": "QueryReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "divinerAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "lat",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "lng",
            "type": "string"
          }
        ],
        "name": "AnswerReceived",
        "type": "event"
      }
    ]);
  }

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
      var xyContract = this.getXYContract();
      var xy = xyContract.new({
        from: web3.eth.accounts[0],
        data: '0x6060604052341561000f57600080fd5b61079e8061001e6000396000f30060606040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632afe70fd146100725780634d0e323a146103655780637fc4077e14610392578063990f4c6f1461042e578063e491650e146104ac575b600080fd5b341561007d57600080fd5b6100a9600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506104d9565b60405180806020018060200180602001806020018060200186810386528b8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101425780601f1061011757610100808354040283529160200191610142565b820191906000526020600020905b81548152906001019060200180831161012557829003601f168201915b505086810385528a8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101c55780601f1061019a576101008083540402835291602001916101c5565b820191906000526020600020905b8154815290600101906020018083116101a857829003601f168201915b50508681038452898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156102485780601f1061021d57610100808354040283529160200191610248565b820191906000526020600020905b81548152906001019060200180831161022b57829003601f168201915b50508681038352888181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156102cb5780601f106102a0576101008083540402835291602001916102cb565b820191906000526020600020905b8154815290600101906020018083116102ae57829003601f168201915b505086810382528781815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561034e5780601f106103235761010080835404028352916020019161034e565b820191906000526020600020905b81548152906001019060200180831161033157829003601f168201915b50509a505050505050505050505060405180910390f35b341561037057600080fd5b61037861050a565b604051808215151515815260200191505060405180910390f35b341561039d57600080fd5b6103c9600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610513565b604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390f35b341561043957600080fd5b610492600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061056f565b604051808215151515815260200191505060405180910390f35b34156104b757600080fd5b6104bf610716565b604051808215151515815260200191505060405180910390f35b6001602052806000526040600020600091509050806000019080600101908060020190806003019080600401905085565b60006001905090565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154905086565b6000808711151561057f57600080fd5b7f7504dfe211cd7e5a51d6cdcb9245552a436b075780a13f65320a855106648f64878787878787604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390a160c0604051908101604052808881526020018773ffffffffffffffffffffffffffffffffffffffff168152602001868152602001858152602001848152602001838152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a08201518160050155905050600190509695505050505050565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154111561076a576001905061076f565b600090505b905600a165627a7a72305820261ae5b8a8b543a04f49e7151ab701ceb20f424ed46cb607a57e702b788466d20029',
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

  XY.CRYPTO.CLIENT.prototype.sendQuery = function(bounty, xyoAddress, accuracy, certainty, delay, epoch, callback) {
    console.log("sendQuery");
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

    var xyContract = this.getXYContract();
    var xyInstance = xyContract.at(this.config.getXYEthContractAddress());
    xyInstance.publishQuery(targetBounty, targetAddress, targetAccuracy, targetCertainty, targetAnswerDelay, targetEpoch, function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.getPendingQueries = function(callback) {
    var xyContract = this.getXYContract();
    var xyInstance = xyContract.at(this.config.getXYEthContractAddress());
    window.arie = xyInstance;
    xyInstance.pendingQueries(this.web3.eth.defaultAccount, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.QUERY.fromArray(result)));
        callback(null, XY.CRYPTO.QUERY.fromArray(result));
      }
    });
  }

  XY.CRYPTO.QUERY = XY.CRYPTO.QUERY || function(bounty, address, accuracy, certainty, delay, epoch) {
    this.bounty = bounty;
    this.address = address;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.delay = delay;
    this.epoch = epoch;
  };

  XY.CRYPTO.QUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.QUERY.constructor = XY.CRYPTO.QUERY;

  XY.CRYPTO.QUERY.fromArray = function(array) {
    return new XY.CRYPTO.QUERY(array[0], array[1], array[2], array[3], array[4], array[5]);
  }

  XY.CRYPTO.QUERY.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.QUERY.prototype.toString = function() {
    return 'XY.CRYPTO.QUERY: Bounty=' + this.bounty
      + ' Address=' + this.address
      + ' Accuracy=' + this.accuracy
      + ' Certainty=' + this.certainty
      + ' Delay=' + this.delay
      + ' Epoch=' + this.epoch
      + '[' + this.secondsAgo() + ' seconds ago]';
  };

  $(document).ready(function() {
    XY.CRYPTO.init();
  });

}());
