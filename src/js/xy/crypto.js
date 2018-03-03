/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: crypto.js
 * @Last modified by:   arietrouw
 * @Last modified time: Friday, March 2, 2018 4:51 PM
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
        data: '0x6060604052341561000f57600080fd5b610bc88061001e6000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312b749321461007d5780632afe70fd146101045780634540b9a3146101a75780637fc4077e14610244578063c9930ee014610313578063e491650e14610376575b600080fd5b341561008857600080fd5b6100ea600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506103a3565b604051808215151515815260200191505060405180910390f35b341561010f57600080fd5b61013b600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107c1565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390f35b34156101b257600080fd5b61022a600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001909190803590602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610823565b604051808215151515815260200191505060405180910390f35b341561024f57600080fd5b61027b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a2e565b604051808881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200197505050505050505060405180910390f35b341561031e57600080fd5b6103346004808035906020019091905050610ab0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561038157600080fd5b610389610aef565b604051808215151515815260200191505060405180910390f35b600060e0604051908101604052808973ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187815260200186815260200185815260200184815260200183815250600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060155905050600280548060010182816104c89190610b4b565b916000526020600020900160008a909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561071f576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166371975d61898989898989896040518863ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001878152602001868152602001858152602001848152602001838152602001828152602001975050505050505050600060405180830381600087803b151561070a57600080fd5b6102c65a03f1151561071b57600080fd5b5050505b7fd9fc59387261346eaef71cb06e6c131973f262bd4f463dd327006a4d0a13fdf388888888888888604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186815260200185815260200184815260200183815260200182815260200197505050505050505060405180910390a160019050979650505050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050154908060060154905087565b6000808811151561083357600080fd5b60e0604051908101604052808981526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff168152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301556080820151816004015560a0820151816005015560c08201518160060160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507f7504dfe211cd7e5a51d6cdcb9245552a436b075780a13f65320a855106648f64888888888888604051808781526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001838152602001828152602001965050505050505060405180910390a160019050979650505050505050565b60006020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905087565b600281815481101515610abf57fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541115610b435760019050610b48565b600090505b90565b815481835581811511610b7257818360005260206000209182019101610b719190610b77565b5b505050565b610b9991905b80821115610b95576000816000905550600101610b7d565b5090565b905600a165627a7a72305820ddbc262f2f4dc7e43514b3ca8dec493b3de482de4a5071a1f066f15292e80cf20029',
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
    xyInstance.publishQuery(targetBounty, targetAddress, targetAccuracy, targetCertainty, targetAnswerDelay, targetEpoch, 0, function(error, result) {
      if (error) {
        console.log("Error: " + error);
      } else {
        console.log("Success: " + result);
      }
    });
  }

  XY.CRYPTO.CLIENT.prototype.sendAnswer = function(xyoAddress, latitude, longitude, altitude, accuracy, certainty, callback) {
    console.log("sendQuery");

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

    var xyContract = this.getXYContract();
    var xyInstance = xyContract.at(this.config.getXYEthContractAddress());
    xyInstance.publishAnswer(xyoAddress, latitude.toString().replace('.', ''), longitude.toString().replace('.', ''), altitude.toString().replace('.', ''), accuracy, certainty, (new Date).getTime(), function(error, result) {
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

  XY.CRYPTO.CLIENT.prototype.getCompleteQueryAddress = function(index, callback) {
    var xyContract = this.getXYContract();
    var xyInstance = xyContract.at(this.config.getXYEthContractAddress());

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

  XY.CRYPTO.CLIENT.prototype.getCompleteQuery = function(address, callback) {
    var xyContract = this.getXYContract();
    var xyInstance = xyContract.at(this.config.getXYEthContractAddress());
    xyInstance.answeredQueries(address, function(error, result) {
      if (error) {
        console.log("Error: " + error);
        callback(error, null);
      } else {
        console.log("Success: " + JSON.stringify(XY.CRYPTO.ANSWER.fromArray(result)));
        callback(null, XY.CRYPTO.ANSWER.fromArray(result));
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
    return 'XY.CRYPTO.QUERY: Bounty=' + this.bounty +
      ' Address=' + this.address +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Delay=' + this.delay +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };

  XY.CRYPTO.ANSWER = XY.CRYPTO.ANSWER || function(address, latitude, longitude, altitude, accuracy, certainty, epoch) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.accuracy = accuracy;
    this.certainty = certainty;
    this.epoch = epoch;
  };

  XY.CRYPTO.ANSWER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.ANSWER.constructor = XY.CRYPTO.ANSWER;

  XY.CRYPTO.ANSWER.fromArray = function(array) {
    return new XY.CRYPTO.ANSWER(array[0], array[1], array[2], array[3], array[4], array[5], array[6]);
  }

  XY.CRYPTO.ANSWER.prototype.secondsAgo = function() {
    return ((new Date).getTime() - this.epoch) / 1000;
  }

  XY.CRYPTO.ANSWER.prototype.toString = function() {
    return 'XY.CRYPTO.QUERY: Address=' + this.address +
      ' Latitude=' + this.latitude +
      ' Longitude=' + this.longitude +
      ' Altitude=' + this.altitude +
      ' Accuracy=' + this.accuracy +
      ' Certainty=' + this.certainty +
      ' Epoch=' + this.epoch +
      '[' + this.secondsAgo() + ' seconds ago]';
  };

  $(document).ready(function() {
    XY.CRYPTO.init();
  });

}());
