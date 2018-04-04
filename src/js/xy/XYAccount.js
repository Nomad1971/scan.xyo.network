/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Wednesday, March 7, 2018 11:24 AM
 * @Email:  developer@xyfindables.com
 * @Filename: xyo-account.js
 * @Last modified by:   arietrouw
 * @Last modified time: Tuesday, April 3, 2018 6:44 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* eslint no-console: 0 */
/* eslint max-len: 0 */

const AmazonCognitoIdentity = require(`amazon-cognito-identity-js`);
const AWS = require(`aws-sdk`);
const XYBase = require(`./XYBase.js`);

class XYAccount extends XYBase {
  constructor() {
    super();
    this.poolData = {
      AuthFlow: `ADMIN_NO_SRP_AUTH`,
      UserPoolId: `us-east-1_owRx9aaS2`,
      ClientId: `5falh570uovkhdq9jiu2u73o2g`,
    };
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
  }

  signUp(_email, _password, _callback) {
    const attributeList = [];

    const dataEmail = {
      Name: `email`,
      Value: _email,
    };

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    this.userPool.signUp(_email, _password, attributeList, null, (_error, _result) => {
      if (_error && _error.statusCode !== 200) {
        _callback(_error, null);
      } else {
        _callback(null, _result);
      }
    });
  }

  facebookSignin(accessToken) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.poolData.UserPoolId,
      Logins: { 'graph.facebook.com': accessToken },
    });

    AWS.config.credentials.get((err) => {
      if (err) {
        console.log(`Error`, err);
      } else {
        console.log(`Cognito Identity Id`, AWS.config.credentials.identityId);
      }
    });
  }

  googleSignin(accessToken) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.poolData.UserPoolId,
      Logins: { 'accounts.google.com': accessToken },
    });

    AWS.config.credentials.get((err) => {
      if (err) {
        console.log(`Error`, err);
      } else {
        console.log(`Cognito Identity Id`, AWS.config.credentials.identityId);
      }
    });
  }

  load() {
    const session = localStorage.getItem(`xySession`);
    if (session) {
      this.session = JSON.parse(session);
    } else {
      this.session = null;
    }
  }

  save(session) {
    this.debug(`Save: ${JSON.stringify(session).length}`);
    this.session = session;
    localStorage.setItem(`xySession`, JSON.stringify(session));
  }

  isSignedIn() {
    if (this.session && this.session.accessToken) {
      return true;
    }
    return false;
  }

  signIn(_email, _password, _callback) {
    const authenticationData = {
      Username: _email,
      Password: _password,
    };

    const userData = {
      Username: _email,
      Pool: this.userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationData, {
      onSuccess(_result) {
        this.save(_result);
        _callback(null, _result);
      },

      onFailure(_error) {
        if (_error.statusCode !== 200) {
          _callback(_error, null);
        }
      },

    });
  }

  signOut() {
    this.save(null);
  }
}

module.exports = XYAccount;
