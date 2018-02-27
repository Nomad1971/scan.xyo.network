/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Tuesday, January 23, 2018 9:36 AM
 * @Email:  developer@xyfindables.com
 * @Filename: popover.js
 * @Last modified by:   arietrouw
 * @Last modified time: Monday, February 26, 2018 10:17 AM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */



(function() {
  "use strict";
  $('[data-toggle="popover"]').popover();
  $(document).click(function(e) {
    $('[data-toggle="popover"]').not(e.target).popover('hide');
    $(e.target).popover('toggle');
  });
}());
