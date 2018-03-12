/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: ajax-setup.js
 * @Last modified by:   arietrouw
 * @Last modified time: Sunday, March 11, 2018 11:33 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

/* global $: true */

$(document).ready(() => {
  $.ajaxSetup({
    crossDomain: true,
  });
});
