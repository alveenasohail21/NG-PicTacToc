/**
 * @ngdoc overview
 * @name app.core
 * @description Core is where the Magma is
 */

(function(){

  'use strict';

  angular.module('app.common')
    .run(function(){

      var imagesAndSvgs = [
        // header
        "images/logo_icon.png",
        "svgs/gray-camera.svg",
        "svgs/blue-camera.svg",
        "svgs/gray-pencil.svg",
        "svgs/blue-pencil.svg",
        "svgs/gray-tick.svg",
        "svgs/blue-tick.svg",
        "images/user_profile_placeholder.png",
        "svgs/gray-cart.svg",
        // step 1
        "images/gray-device-cloud.png",
        "images/blue-device-cloud.png",
        "svgs/gray-facebook.svg",
        "svgs/blue-facebook.svg",
        "svgs/gray-instagram.svg",
        "svgs/blue-instagram.svg",
        "svgs/gray-flickr.svg",
        "svgs/blue-flickr.svg",
        "svgs/gray-google.svg",
        "svgs/blue-google.svg",
        "svgs/gray-arrow-down.svg",
        // light slider
        "images/gray-left-arrow-slider.png",
        "images/white-cross.png",
        "images/add_image.png",
        "images/gray-right-arrow-slider.png",
        "images/gray-expand.png",
        "images/gray-left-arrow-slider.png",
        "images/gray-right-arrow-slider.png",
        // ptt-loader
        'svgs/ptt-loader.svg',
        // step 2
        "svgs/gray-layout.svg",
        "svgs/blue-layout.svg",
        "svgs/gray-filter.svg",
        "svgs/blue-filter.svg",
        "svgs/gray-text.svg",
        "svgs/blue-text.svg",
        "svgs/gray-sticker.svg",
        "svgs/blue-sticker.svg",
        "svgs/gray-photos.svg",
        "svgs/gray-question.svg",
        "images/gray-share.png",
        "images/gray-copy.png",
        "svgs/gray-delete.svg",
        "images/left-size-arrow.png",
        "images/right-size-arrow.png",
        "svgs/gray-border-none.svg",
        "svgs/gray-rotate-1.svg",
        "svgs/gray-rotate-1.svg",
        "svgs/gray-flip-h.svg",
        "svgs/gray-flip-v.svg",
        "images/gray-collapse.png",
        "images/white-copy.png",
        "svgs/white-delete.svg"
        // step 3
      ];

      var fontClasses = [
        "font-myriad-regular",
        "font-myriad-bold",
        "font-opensans-semibold",
        "font-opensans-regular",
        "font-opensans-bold"
      ];

      // initializer
      function init(){
        $(document).ready(function() {
          console.log("LOADING ASSETS");
          loadImagesAndSvgs();
          loadFonts();
        });
      }

      // load svgs and images
      function loadImagesAndSvgs(){
        for(var i=0; i<imagesAndSvgs.length; i++){
          (function(){
            var img = new Image();
            img.src = imagesAndSvgs[i];
          }());
        }
      }

      // load fonts
      function loadFonts(){
        for(var i=0; i<fontClasses.length; i++){
          (function(){
            var hiddenElem = $('<p class="'+ fontClasses[i] +'"></p>', { css: { 'visibility': 'hidden' }});
            $('body').append(hiddenElem);
          }());
        }
      }

      // call initializer
      init();

    })

}());
