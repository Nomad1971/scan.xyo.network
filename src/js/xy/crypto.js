/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: crypto.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, February 26, 2018 6:56 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */



var XY;

(function() {
  "use strict";

  XY = XY || {};

  XY.CRYPTO = XY.CRYPTO || {
    init: function() {
      console.log("XY.CRYPTO Init");
    }
  };

  XY.CRYPTO.BASE = XY.CRYPTO.BASE || function(address) {
    this.address = address;
  };

  XY.CRYPTO.BASE.prototype.toString = function() {
    return "XY.CRYPTO.BASE: " + this.address;
  };

  XY.CRYPTO.EXCEPTION = XY.CRYPTO.EXCEPTION || function(type, code, message) {
    this.type = type;
    this.code = code;
    this.message = message;
  }

  XY.CRYPTO.EXCEPTION.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.EXCEPTION.constructor = XY.CRYPTO.EXCEPTION;

  XY.CRYPTO.CONFIG = XY.CRYPTO.CONFIG || function(name) {
    name = name || "default";
    var obj = JSON.parse(localStorage.getItem("xy-crypto-config-" + name));
    if (obj) {
      for(var field in obj){
        if (obj.hasOwnProperty(field)) {
          this[field]=obj[field];
        }
      }
    } else {
      //set defaults
      this.diviner = "localhost:24456";
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

  XY.CRYPTO.CONFIG.prototype.save = function(name) {
    name = name || "default";
    localStorage.setItem("xy-crypto-config-" + name, JSON.stringify(this));
    return this;
  }

  XY.CRYPTO.CLIENT = XY.CRYPTO.CLIENT || function(onWalletChange) {
    var self = this;
    if (typeof web3 === "undefined") {
      throw new XY.CRYPTO.EXCEPTION(XY.CRYPTO.CLIENT, 1, "Web3 Undefined");
    }
    this.web3 = new Web3(web3.currentProvider);
    this.etherWallet = null;
    this.onWalletChange = onWalletChange;
    this.purchaseContractAddress = window.salesContract || "0x4b57484ec9c705a96d6bA06A0Dd94b1B5b385535";
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

  XY.CRYPTO.CLIENT.prototype.XYOperETH = function() {
    return 200000;
  }

  XY.CRYPTO.CLIENT.prototype.purchase = function(ether) {
    var self = this;
    var wei = web3.toWei(ether, 'ether');
    var contract = self.web3.eth.sendTransaction({from:self.etherWallet, to:self.purchaseContractAddress, value: wei, gas:200000, gasPrice:20000000000 }, function(error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getDAppNetworkName = function(callback) {
    this.web3.version.getNetwork(function (error, netId){
      switch (netId) {
        case "1":
          callback(null, "ETH-Main");
          break;
        case "2":
          callback(null, "ETH-Morden");
          break;
        case "3":
          callback(null, "ETH-Ropsten");
          break;
        case "4":
          callback(null, "ETH-Rinkeby");
          break;
        case "42":
          callback(null, "ETH-Kovan");
          break;
        default:
          callback(null, "Unknown");
          break;
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getXyoNetworkName = function(callback) {
    callback(null, "XYO-Main");
  };

  XY.CRYPTO.CLIENT.prototype.getDAppBalance = function (callback) {
    var self = this;
    self.web3.eth.getBalance(self.etherWallet, function (error, result) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {raw:result, cooked:self.web3.fromWei(result, 'ether')});
      }
    });
  };

  XY.CRYPTO.CLIENT.prototype.getXyoBalance = function (callback) {
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
          callback(null, {raw:result, cooked:self.web3.fromWei(result, 'ether')});
        }
      }
    });
  };

  XY.CRYPTO.SENTINEL = XY.CRYPTO.SENTINEL || function(address) {
    this.address = address;
    this.ledger = [];
  };

  XY.CRYPTO.SENTINEL.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.SENTINEL.constructor = XY.CRYPTO.SENTINEL;

  XY.CRYPTO.SENTINEL.prototype.toString = function() {
    return "XY.CRYPTO.SENTINEL: " + this.address;
  };

  XY.CRYPTO.BRIDGE = XY.CRYPTO.BRIDGE || function(address) {
    this.address = address;
  };

  XY.CRYPTO.BRIDGE.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.BRIDGE.constructor = XY.CRYPTO.BRIDGE;

  XY.CRYPTO.BRIDGE.prototype.toString = function() {
    return "XY.CRYPTO.BRIDGE: " + this.address;
  };

  XY.CRYPTO.ARCHIVER = XY.CRYPTO.ARCHIVER || function(address) {
    this.address = address;
  };

  XY.CRYPTO.ARCHIVER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.ARCHIVER.constructor = XY.CRYPTO.ARCHIVER;

  XY.CRYPTO.ARCHIVER.prototype.toString = function() {
    return "XY.CRYPTO.ARCHIVER: " + this.address;
  };

  XY.CRYPTO.DIVINER = XY.CRYPTO.DIVINER || function(address) {
    this.address = address;
  };

  XY.CRYPTO.DIVINER.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.DIVINER.constructor = XY.CRYPTO.DIVINER;

  XY.CRYPTO.DIVINER.prototype.toString = function() {
    return "XY.CRYPTO.DIVINER: " + this.address;
  };

  XY.CRYPTO.DIVINER.prototype.getPending = function(callback) {
    console.log("getPending");
    $.ajax({
      method: "get",
      contentType: "application/json",
      url: "http://" + this.address + "/pending",
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
        throw {message:"Please specify a target address"};
      } else if (this.bounty < 1) {
        throw {message:"Bounty is too low (minimum 1)"};
      } else if (nowEpoch < this.epoch) {
        throw {message:"Please specify a time in the past (" + nowEpoch + ")"};
      } else if (this.accuracy <= 0) {
        throw {message:"Accuracy must be a positive number"};
      } else if (this.certainty <= 0) {
        throw {message:"Certainty must be a positive number"};
      } else if (this.answerDelay < 0) {
        throw {message:"Answer Delay must be a positive number"};
      } else if (this.gas < 20000) {
        throw {message:"Ether Gas too low. (Min 20000)"};
      } else if (typeof web3 === "undefined") {
        throw {message:"Wallet not detected.  Please install Meta Mask."};
      }
  };

  XY.CRYPTO.QUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.QUERY.constructor = XY.CRYPTO.QUERY;

  XY.CRYPTO.QUERY.prototype.toString = function() {
    return "XY.CRYPTO.QUERY: " + this.targetAddress;
  };

  XY.CRYPTO.QUERY.prototype.send = function() {

      var web3Instance = new Web3(web3.currentProvider);
      web3Instance.eth.defaultAccount = web3.eth.accounts[0];

      var contractDesc = [{
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "questions",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "bounty",
            "type": "uint256"
          },
          {
            "name": "linkId",
            "type": "address"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "accuracy",
            "type": "uint32"
          },
          {
            "name": "certainty",
            "type": "uint32"
          },
          {
            "name": "answerDelay",
            "type": "uint256"
          }
        ],
        "name": "ask",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }];

      var AskQuestion = web3Instance.eth.contract(contractDesc);

      var question = AskQuestion.at("0xeD90D4979cEF2f23a593f871C59CA40f4905E547");

      question.ask(
        this.bounty, this.targetAddress, this.epoch, this.accuracy, this.certainty, this.answerDelay,
        {value:0, gas:this.ether},
        function(error, result){
          if (error) {
            alert("Error: " + error);
          } else {
            alert("Tx: " + result);
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
        throw "Please specify a target address";
      } else if (this.bounty < 1000) {
        throw "Bounty is too low (minimum 1000)";
      } else if (nowEpoch < this.epoch) {
        throw "Please specify a time in the past (" + nowEpoch + ")";
      } else if (this.accuracy <= 0) {
        throw "Accuracy must be a positive number";
      } else if (this.certainty <= 0) {
        throw "Certainty must be a positive number";
      } else if (this.answerDelay < 0) {
        throw "Answer Delay must be a positive number";
      } else if (this.gas < 20000) {
        throw "Ether Gas too low. (Min 20000)";
      } else if (typeof web3 === "undefined") {
        throw "Wallet not detected.  Please install Meta Mask.";
      }
  };

  XY.CRYPTO.QUERY.prototype = new XY.CRYPTO.BASE();
  XY.CRYPTO.QUERY.constructor = XY.CRYPTO.QUERY;

  XY.CRYPTO.QUERY.prototype.toString = function() {
    return "XY.CRYPTO.QUERY: " + this.targetAddress;
  };

  XY.CRYPTO.QUERY.prototype.send = function() {

      var web3Instance = new Web3(web3.currentProvider);
      web3Instance.eth.defaultAccount = web3.eth.accounts[0];

      var contractDesc = [{
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "questions",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "bounty",
            "type": "uint256"
          },
          {
            "name": "linkId",
            "type": "address"
          },
          {
            "name": "epoch",
            "type": "uint256"
          },
          {
            "name": "accuracy",
            "type": "uint32"
          },
          {
            "name": "certainty",
            "type": "uint32"
          },
          {
            "name": "answerDelay",
            "type": "uint256"
          }
        ],
        "name": "ask",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }];

      var AskQuestion = web3Instance.eth.contract(contractDesc);

      var question = AskQuestion.at("0xeD90D4979cEF2f23a593f871C59CA40f4905E547");

      question.ask(
        this.bounty, this.targetAddress, this.epoch, this.accuracy, this.certainty, this.answerDelay,
        {value:0, gas:this.ether},
        function(error, result){
          if (error) {
            alert("Error: " + error);
          } else {
            alert("Tx: " + result);
          }
        }
      );
  };

  $(document).ready(function() {
    XY.CRYPTO.init();
  });

}());
