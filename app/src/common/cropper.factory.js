/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('cropperFactory', cropperFactory);

  function cropperFactory(){
    /*Default Configurations*/
    var defaultOptions = {
      guides: false,
      viewMode: 3,
      dragMode: 'move',
      toggleDragModeOnDblclick: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      autoCropArea: '1',
      minCropBoxHeight: '100%',
      minCropBoxWidth: '100%'
    };

    var defaultRotateOptions={
      clockwise: -90,
      antiClockwise: 90
    };
    var element, currentZoom = 0;
    /* Return Functions */
    return {
      initiateCrop: initiateCrop,
      flipHorizontal: flipHorizontal,
      flipVertical: flipVertical,
      rotateClockwise: rotateClockwise,
      rotateAntiClockwise: rotateAntiClockwise,
      getImageDetails: getImageDetails,
      zoom: zoom,
      reset: reset,
      destroy: destroy
    };
    /* Define Fuctions */

    function initiateCrop(id, options){
      element = $(id);
      element.cropper(options || defaultOptions);
    }

    function flipHorizontal(){
      if(element)
        element.cropper('scale', toggleScale(element.cropper('getData').scaleX), element.cropper('getData').scaleY);
    }

    function flipVertical(){
      if(element)
        element.cropper('scale', element.cropper('getData').scaleX, toggleScale(element.cropper('getData').scaleY));
    }

    function rotateClockwise(option){
      if(element)
        element.cropper('rotate', option || defaultRotateOptions.clockwise);
    }

    function rotateAntiClockwise(option){
      if(element)
        element.cropper('rotate', option || defaultRotateOptions.antiClockwise);
    }

    function zoom(zoomValue){
      if(element)
        element.cropper('zoomTo', zoomValue);
    }

    function toggleScale(scaleValue){
      if(!element) return;
      if(scaleValue==1)
        return -1;
      return 1;
    }

    function reset(){
      if(element)
        element.cropper('reset');
    }

    function destroy(){
      if(element)
        element.cropper('destroy');
    }

    function getImageDetails(){
      var details = element.cropper('getData');
      console.log("CONFIGS TO SERVER: ", details);
      return {
        "crop":{
          "width":details.width,
          "height":details.height,
          "x" : details.x,
          "y" : details.y
        },
        "rotate" : {
          // multiply by -1 due to laravel image intervention
          "angle": details.rotate*-1
        },
        "scale" : {
          "scaleX" : details.scaleX,
          "scaleY" : details.scaleY
        }
      }
    }

  }
}());