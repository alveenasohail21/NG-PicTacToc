/**
 * @ngdoc directive
 * @name app.common.directive:ptt-loader
 * @scope true
 * @param {object} test test object
 * @restrict E
 *
 * @description < description placeholder >
 *
 */

(function(){

  'use strict';

  angular
    .module('app.common')
    .directive('pttLoader', pttLoader);

  /* @ngInject */
  function pttLoader(){

    return {
      link: link,
      restrict: 'A'
    };

    /////////////////////

    function link(scope, elem, attrs){

      // update/remove
      elem.addClass('blur-5px');
      switch(attrs.pttLoader){
        case 'loader-fb-photo':
          elem.siblings().css('display', 'none');
          break;
      }

      // add loader html
      elem.before(
        "<div class='ptt-loader'>"
        + "<img class='" + attrs.pttLoader + "' src='svgs/ptt-loader.svg' alt='Loading..'>"
        + "</div>"
      );

      // attach event
      elem.on('load', function(){
        elem.removeClass('blur-5px');
        elem.prev().css('display', 'none');

        switch(attrs.pttLoader){
          case 'loader-fb-photo':
            elem.siblings().css('display', 'inline');
            elem.prev().css('display', 'none');
            break;
        }

      });

    }
  }

}());
