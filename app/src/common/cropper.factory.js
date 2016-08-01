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
            reset: reset
        };
        /* Define Fuctions */

        function initiateCrop(id, options){
            element = $(id);
            element.cropper(options || defaultOptions);
        }
        function flipHorizontal(){
            var imageData=$("#selected-image").cropper('getData');
            element.cropper('scale', toggleScale(imageData.scaleX), imageData.scaleY);
        }
        function flipVertical(){
            var imageData=$("#selected-image").cropper('getData');
            element.cropper('scale', imageData.scaleX, toggleScale(imageData.scaleY));
        }
        function rotateClockwise(option){
            element.cropper('rotate', option || defaultRotateOptions.clockwise);
        }
        function rotateAntiClockwise(option){
            element.cropper('rotate', option || defaultRotateOptions.antiClockwise);
        }
        function zoom(zoomValue){
            element.cropper('zoomTo', zoomValue);
        }
        function toggleScale(scaleValue){
            if(scaleValue==1)
                return -1;
            return 1;
        }
        function getImageDetails(){
            var details=element.cropper('getData');
            return {
                "crop":{
                    "width":details.width,
                    "height":details.height,
                    "x" : details.x,
                    "y" : details.y
                },
                "rotate" : {
                    "angle":details.rotate
                },
                "scale" : {
                    "scaleX" : details.scaleX,
                    "scaleY" : details.scaleY
                }
            }
        }
        function reset(){
            element.cropper('reset');
        }
    }
}());