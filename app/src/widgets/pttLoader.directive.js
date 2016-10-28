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
      scope: {
        keepAspectRatio: '@'
      },
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
        + "<img class='" + attrs.pttLoader + "' src='" + safeTemplateUrlConvert('svgs/ptt-loader.svg') + "' alt='Loading..'>"
        + "</div>"
      );

      // attach event
      elem.on('load', function(){

        if(scope.keepAspectRatio){
          // keep aspect ratio and put image in center
          // console.log("ELEM: ", elem, elem[0].naturalWidth, elem[0].naturalHeight);
          if(elem[0].naturalWidth > elem[0].naturalHeight){
            $(elem).css('height', '100%');
          }
          else{
            $(elem).css('width', '100%');
          }
          //// console.log('ELEM WIDTH HEIGHT: ', elem.width(), elem.height());
          //$(elem).css({
          //  position: 'absolute',
          //  top: '50%',
          //  left: '50%',
          //  'margin-left': '-'+elem.width()/2+'px',
          //  'margin-top': '-'+elem.height()/2+'px'
          //});
        }

        elem.removeClass('blur-5px');
        elem.prev().css('display', 'none');

        switch(attrs.pttLoader){
          case 'loader-fb-photo':
            $('.abort-uploading').css('opacity', 1);
            elem.siblings().css('display', 'block');
            elem.prev().css('display', 'none');
            break;
        }

      });

    }
  }

}());
