/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 7, 2018 11:24 AM
 * @Email:  developer@xyfindables.com
 * @Filename: xyo-account.js
 * @Last modified by:   arietrouw
 * @Last modified time: Wednesday, March 7, 2018 1:50 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* global XYO:true */
/* global AmazonCognitoIdentity:true */
/* eslint no-console: 0 */
/* eslint max-len: 0 */

window.XYO = window.XYO || {
};

XYO.ACCOUNT = XYO.ACCOUNT || function () {
};

XYO.ACCOUNT.signUp = function (_email, _password, _callback) {
  const poolData = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: 'us-east-1_owRx9aaS2',
    ClientId: '5falh570uovkhdq9jiu2u73o2g',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Value: _email,
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  userPool.signUp(_email, _password, attributeList, null, (_error, _result) => {
    if (_error && _error.statusCode !== 200) {
      _callback(_error, null);
    } else {
      window.arie = _result;
      _callback(null, _result);
    }
  });
};

XYO.ACCOUNT.signIn = function (_email, _password, _callback) {
  const authenticationData = {
    Username: _email,
    Password: _password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const poolData = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: 'us-east-1_owRx9aaS2',
    ClientId: '5falh570uovkhdq9jiu2u73o2g',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username: _email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(_result) {
      _callback(null, _result);
    },

    onFailure(_error) {
      _callback(_error, null);
    },

  });
};
