/**
 * @ngdoc directive
 * @name app.dashboard.directive:lightSlider
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
    .module('app.dashboard')
    .directive('pttStickers', pttStickers);

  /* @ngInject */
  function pttStickers($timeout){

    // would be get from server, only active stickers will be shown
    var stickers = [
      {
        url: 'images/sidemenu/stickers/2.png',
        isActive: true
      },
      {
        url: 'images/sidemenu/stickers/3.png',
        isActive: true
      },
      {
        url: 'images/sidemenu/stickers/5.png',
        isActive: true
      },
      {
        url: 'images/sidemenu/stickers/4.png',
        isActive: true
      },
      {
        url: 'images/sidemenu/stickers/1.png',
        isActive: true
      },
      {
        url: 'images/sidemenu/stickers/6.png',
        isActive: true
      }
    ];

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/stickers.html',
      scope: {
        onSelect: '&onSelect'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      // Initializer
      function init(){
        // TODO: Fetch stickers from server
        setupFilters();
      }

      // setup stickers
      function setupFilters(){
        if(stickers.length>0){
          console.log("RUNNING STICKERS SETUP: ");
          scope.stickers = stickers;
          loadStickers();
        }
        else{
          console.log("NO STICKER, NO SETUP");
        }
      }

      // load stickers
      function loadStickers(){
        for(var i=0; i<scope.stickers.length; i++){
          (function(){
            var stickerToLoad = scope.stickers[i];
            console.log("LOADING STICKER: ",stickerToLoad);
              var img = new Image();
              img.src = stickerToLoad;
          }());
        }
      }

      // pagination


      // call initializer
      init();

    }

  }

}());
