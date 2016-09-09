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
  function pttStickers($timeout,restFactory){

    // would be get from server, only active stickers will be shown
    var stickers = [
      {
        url: 'media/public/stickers/2.png',
        isActive: true
      },
      {
        url: 'media/public/stickers/3.png',
        isActive: true
      },
      {
        url: 'media/public/stickers/5.png',
        isActive: true
      },
      {
        url: 'media/public/stickers/4.png',
        isActive: true
      },
      {
        url: 'media/public/stickers/1.png',
        isActive: true
      },
      {
        url: 'media/public/stickers/6.png',
        isActive: true
      }
    ];
    var defaultQuery = {
      type : 'stickers',
      from : 0,
      size : 2,
      all : false
    };


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
        getStickersFromServer();
        bindLoadMoreStickers();
      }
      // load sticker
      function getStickersFromServer() {
        restFactory.media.get(defaultQuery).then(function (resp) {
          stickers = resp.data;
          setupFilters();
        })
      }
      // Pagination
      function bindLoadMoreStickers(){
        var stickerDiv = angular.element('.sidemenu-stickers');
        stickerDiv.scroll(function(){
          var offset = 20;
          var stickerDivHeight = stickerDiv.height();
          var scrollBottom = stickerDiv.scrollTop() + stickerDivHeight + offset;
          var stickerDivScrollHeight = stickerDiv[0].scrollHeight;
          if(scrollBottom >= stickerDivScrollHeight ){
            // console.log("fetching more images");
            loadMoreStickers();
          }
        });
      }

      function loadMoreStickers() {
        var data = defaultQuery;
        data.from += 2;
        restFactory.media.get(data).then(function (resp) {
          stickers.push.apply(stickers,resp.data);
          console.log('stickers',stickers);
          setupFilters();
          $timeout(function () {
            $(function() {
              $('#gallery-container').snapGallery({
                maxCols: 2,
                margin: 5,
                minWidth: 100
              });
            });
          });
        })
      }

      // setup stickers
      function setupFilters(){
        if(stickers.length>0){
          // console.log("RUNNING STICKERS SETUP: ");
          scope.stickers = stickers;
          loadStickers();
        }
        else{
          // console.log("NO STICKER, NO SETUP");
        }
      }

      // load stickers
      function loadStickers(){
        for(var i=0; i<scope.stickers.length; i++){
          (function(){
            var stickerToLoad = scope.stickers[i];
            // console.log("LOADING STICKER: ",stickerToLoad);
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
