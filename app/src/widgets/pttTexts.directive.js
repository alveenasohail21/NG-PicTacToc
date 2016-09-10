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
    .directive('pttTexts', pttTexts);

  /* @ngInject */
  function pttTexts($timeout,restFactory){

    // would be get from server, only active texts will be shown
    var texts =[
      {
        name: 'MyriadPro_SemiBold',
        url: 'media/public/fonts/MYRIADPRO-SEMIBOLD.OTF',
        isActive: true,
        selected: false
      },
      {
        name: 'MyriadPro_CondIt',
        url: 'media/public/fonts/MYRIADPRO-CONDIT.OTF',
        isActive: true,
        selected: false
      },
      {
        name: 'Kelvitca_Nobis',
        url: 'media/public/fonts/Kelvetica Nobis.otf',
        isActive: true,
        selected: false
      },
      {
        name: 'OpenSans_LightItalic',
        url: 'media/public/fonts/OpenSans-LightItalic.ttf',
        isActive: true,
        selected: false
      }
    ];

    var defaultQuery = {
      type : 'fonts',
      from : 0,
      size : 12,
      all : false
    };


    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/texts.html',
      scope: {
        onSelect: '&onSelect'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      scope.selectedText=selectedText;

      // Initializer
      function init(){
        // TODO: Fetch texts from server
        //getTextFromServer();
        //bindLoadMoreStickers();
        setupTexts();
      }
      function getTextFromServer() {
        restFactory.media.get(defaultQuery).then(function (resp) {
          texts = resp.data;
          setupTexts();
        })
      }
      // Pagination
      function bindLoadMoreStickers(){
        var stickerDiv = angular.element('.sidemenu-texts');
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
        data.from += 12;
        restFactory.media.get(data).then(function (resp) {
          texts.push.apply(texts,resp.data);
          setupTexts();
        })
      }


      // setup text
      function setupTexts(){
        if(texts.length>0){
          // console.log("RUNNING TEXTS SETUP: ");
          scope.texts = texts;
          loadTexts();
        }
        else{
          // console.log("NO TEXT, NO SETUP");
        }
      }

      // load texts
      function loadTexts(){
        for(var i=0; i<scope.texts.length; i++){
          (function(){
            var textToLoad = scope.texts[i];
            // console.log("LOADING TEXTS AS CSS: ",textToLoad);
            $("head").prepend("<style type=\"text/css\">" +
              "@font-face {\n" +
              "\tfont-family: \""+ textToLoad.name +"\";\n" +
              "\tsrc: url('"+ textToLoad.url +"');\n" +
              "}\n" +
              "\t.font-"+ textToLoad.name +" {\n" +
              "\tfont-family: "+ textToLoad.name +" !important;\n" +
              "}\n" +
              "</style>");
          }());
        }
      }

      // pagination

      function selectedText(text, index) {
        //scope.texts[index].selected = true;
        scope.onSelect({text: text});
      }


      // call initializer
      init();


    }

  }

}());
