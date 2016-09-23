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
        // step 1
        "svgs/gray-border-noBorder-1.svg",
        "svgs/gray-border-fullBorder-1.svg",
        "svgs/gray-border-outerBorder-1.svg",
        "svgs/gray-border-innerBorder-1.svg",
        "svgs/gray-rotate-1.svg",
        "svgs/gray-rotate-1.svg",
        "svgs/gray-flip-h-1.svg",
        "svgs/gray-flip-v-1.svg",
        "svgs/gray-delete-1.svg",
        "svgs/gray-copy-1.svg",
        "images/gray-share-1.png",
        "svgs/gray-question-1.svg",

        // step 2
        "svgs/gray-border-noBorder-2.svg",
        "svgs/gray-border-fullBorder-2.svg",
        "svgs/gray-border-outerBorder-2.svg",
        "svgs/gray-border-innerBorder-2.svg",
        "svgs/gray-rotate-2.svg",
        "svgs/gray-rotate-2.svg",
        "svgs/gray-flip-h-2.svg",
        "svgs/gray-flip-v-2.svg",
        "svgs/gray-delete-2.svg",
        "svgs/gray-copy-2.svg",
        "images/gray-share-2.png",
        "svgs/gray-question-2.svg",

        // step 3
        "svgs/gray-border-noBorder-3.svg",
        "svgs/gray-border-fullBorder-3.svg",
        "svgs/gray-border-outerBorder-3.svg",
        "svgs/gray-border-innerBorder-3.svg",
        "svgs/gray-rotate-3.svg",
        "svgs/gray-rotate-3.svg",
        "svgs/gray-flip-h-3.svg",
        "svgs/gray-flip-v-3.svg",
        "svgs/gray-delete-3.svg",
        "svgs/gray-copy-3.svg",
        "images/gray-share-3.png",
        "svgs/gray-question-3.svg",


        "svgs/gray-layout.svg",
        "svgs/blue-layout.svg",
        "svgs/gray-filter.svg",
        "svgs/blue-filter.svg",
        "svgs/gray-text.svg",
        "svgs/blue-text.svg",
        "svgs/gray-sticker.svg",
        "svgs/blue-sticker.svg",
        "svgs/gray-photos.svg",
        "images/gray-copy.png",
        "images/left-size-arrow.png",
        "images/right-size-arrow.png",
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
          console.log("Assets: Loading");
          loadImagesAndSvgs();
          loadFonts();
          //stopDebug();
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
            var hiddenElem = $('<p class="'+ fontClasses[i] +'">.</p>');
            hiddenElem.css({'margin-top':'4000px'});
            $('body').append(hiddenElem);
          }());
        }
      }

      // stop debug mode
      function stopDebug(){
        console.log = function(){

        }
      }

      // call initializer
      init();

    })

}());
