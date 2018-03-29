/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: gulpfile.js
 * @Last modified by:   arietrouw
 * @Last modified time: Thursday, March 29, 2018 12:01 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

process.env.DEBUG = `*`;

const xyo = require(`./gulp/index.js`);
xyo.browse.config(8080);
