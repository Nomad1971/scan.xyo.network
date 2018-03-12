/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: all-require.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 10:54 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

// we are assigning the global jquery here to make sure they are available for following module
// see: https://stackoverflow.com/questions/33019133/browserify-change-the-order-the-dependencies-are-loaded

global.jQuery = require(`jquery`);
global.$ = global.jQuery;

require(`bootstrap`);

require(`./xy/XYAccount.js`);
require(`./xy/XYBase.js`);
require(`./xy/XYClient.js`);
require(`./xy/XYConfig.js`);
require(`./xy/XYContract.js`);

require(`./ajax-setup.js`);
