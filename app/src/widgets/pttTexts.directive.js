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
  function pttTexts($timeout){

    // would be get from server, only active texts will be shown
    var texts = [
      {
        name: 'MyriadPro_SemiBold',
        url: '/fonts/Myriad_Pro/MYRIADPRO-SEMIBOLD.OTF',
        isActive: true,
        selected: false
      },
      {
        name: 'MyriadPro_CondIt',
        url: '/fonts/Myriad_Pro/MYRIADPRO-CONDIT.OTF',
        isActive: true,
        selected: false
      },
      {
        name: 'Kelvitca_Nobis',
        url: '/fonts/Kelvetica Nobis.otf',
        isActive: true,
        selected: false
      },
      {
        name: 'OpenSans_LightItalic',
        url: '/fonts/Open_Sans/OpenSans-LightItalic.ttf',
        isActive: true,
        selected: false
      }
    ];

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
        setupTexts();
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
