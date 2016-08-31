/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('designTool', designTool);

  function designTool(){

    /*
    * Data
    * */
    var customType = [
      'Layout',
      'Filter',
      'Text',
      'Sticker',
      'BackgroundImage'
    ];
    var currentLayoutSections = [];
    var sectionBkgImages = [];
    var currentSectionIndex = 0;
    var zoomSlider;
    //var originalScale = {           // originalScale will be added in fabric image object
    //  x: 0,
    //  y: 0
    //};
    var fabricCanvas;
    // fabric objects default setting
    var fabricObjSettings = {
      borderColor: 'white',
      borderDashArray: [5, 5],
      cornerColor: 'rgba(101,224,228,0.7)',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderOpacityWhenMoving: 0.6,
      hoverCursor: 'move',
      transparentCorners: false,
      originX: 'center',
      originY: 'center'
    };

    /* Return Functions */
    return {
      initializeTool: initializeTool,
      // Toolbar methods
      applyBorder: applyBorder,
      flipHorizontal: flipHorizontal,
      flipVertical: flipVertical,
      rotateClockwise: rotateClockwise,
      rotateAntiClockwise: rotateAntiClockwise,
      // Left sidemenu methods
      applyFilter: applyFilter,
      applySticker: applySticker,
      applyText: applyText,
      applyLayout: applyLayout,
      // Customizer methods
      updateTextSize: updateTextSize,
      updateTextColor: updateTextColor,
      deleteSelectedObject: deleteSelectedObject,
      copySelectedObject: copySelectedObject
    };

    /* Define Functions */

    function initializeTool(htmlElement){

    }

    function applyBorder(){

    }

    function flipHorizontal(){

    }

    function flipVertical(){

    }

    function rotateClockwise(){

    }

    function rotateAntiClockwise(){

    }

    function applyFilter(){

    }

    function applySticker(){

    }

    function applyText(){

    }

    function applyLayout(){

    }

    function updateTextSize(){

    }

    function updateTextColor(){

    }

    function deleteSelectedObject(){

    }

    function copySelectedObject(){

    }

  }
}());
