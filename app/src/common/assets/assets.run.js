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
        safeTemplateUrlConvert("images/logo_icon.png"),
        safeTemplateUrlConvert("svgs/gray-camera.svg"),
        safeTemplateUrlConvert("svgs/blue-camera.svg"),
        safeTemplateUrlConvert("svgs/gray-pencil.svg"),
        safeTemplateUrlConvert("svgs/blue-pencil.svg"),
        safeTemplateUrlConvert("svgs/gray-tick.svg"),
        safeTemplateUrlConvert("svgs/blue-tick.svg"),
        safeTemplateUrlConvert("images/user_profile_placeholder.png"),
        safeTemplateUrlConvert("svgs/gray-cart.svg"),
        // step 1
        safeTemplateUrlConvert("images/gray-device-cloud.png"),
        safeTemplateUrlConvert("images/blue-device-cloud.png"),
        safeTemplateUrlConvert("svgs/gray-facebook.svg"),
        safeTemplateUrlConvert("svgs/blue-facebook.svg"),
        safeTemplateUrlConvert("svgs/gray-instagram.svg"),
        safeTemplateUrlConvert("svgs/blue-instagram.svg"),
        safeTemplateUrlConvert("svgs/gray-flickr.svg"),
        safeTemplateUrlConvert("svgs/blue-flickr.svg"),
        safeTemplateUrlConvert("svgs/gray-google.svg"),
        safeTemplateUrlConvert("svgs/blue-google.svg"),
        safeTemplateUrlConvert("svgs/gray-arrow-down.svg"),
        // light slider
        safeTemplateUrlConvert("images/gray-left-arrow-slider.png"),
        safeTemplateUrlConvert("images/white-cross.png"),
        safeTemplateUrlConvert("images/add_image.png"),
        safeTemplateUrlConvert("images/gray-right-arrow-slider.png"),
        safeTemplateUrlConvert("images/gray-expand.png"),
        safeTemplateUrlConvert("images/gray-left-arrow-slider.png"),
        safeTemplateUrlConvert("images/gray-right-arrow-slider.png"),
        // ptt-loader
        safeTemplateUrlConvert('svgs/ptt-loader.svg'),
        // step 1
        safeTemplateUrlConvert("svgs/gray-border-noBorder-1.svg"),
        safeTemplateUrlConvert("svgs/gray-border-fullBorder-1.svg"),
        safeTemplateUrlConvert("svgs/gray-border-outerBorder-1.svg"),
        safeTemplateUrlConvert("svgs/gray-border-innerBorder-1.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-1.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-1.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-h-1.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-v-1.svg"),
        safeTemplateUrlConvert("svgs/gray-delete-1.svg"),
        safeTemplateUrlConvert("svgs/gray-copy-1.svg"),
        safeTemplateUrlConvert("images/gray-share-1.png"),
        safeTemplateUrlConvert("svgs/gray-question-1.svg"),

        // step 2
        safeTemplateUrlConvert("svgs/gray-border-noBorder-2.svg"),
        safeTemplateUrlConvert("svgs/gray-border-fullBorder-2.svg"),
        safeTemplateUrlConvert("svgs/gray-border-outerBorder-2.svg"),
        safeTemplateUrlConvert("svgs/gray-border-innerBorder-2.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-2.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-2.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-h-2.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-v-2.svg"),
        safeTemplateUrlConvert("svgs/gray-delete-2.svg"),
        safeTemplateUrlConvert("svgs/gray-copy-2.svg"),
        safeTemplateUrlConvert("images/gray-share-2.png"),
        safeTemplateUrlConvert("svgs/gray-question-2.svg"),

        // step 3
        safeTemplateUrlConvert("svgs/gray-border-noBorder-3.svg"),
        safeTemplateUrlConvert("svgs/gray-border-fullBorder-3.svg"),
        safeTemplateUrlConvert("svgs/gray-border-outerBorder-3.svg"),
        safeTemplateUrlConvert("svgs/gray-border-innerBorder-3.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-3.svg"),
        safeTemplateUrlConvert("svgs/gray-rotate-3.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-h-3.svg"),
        safeTemplateUrlConvert("svgs/gray-flip-v-3.svg"),
        safeTemplateUrlConvert("svgs/gray-delete-3.svg"),
        safeTemplateUrlConvert("svgs/gray-copy-3.svg"),
        safeTemplateUrlConvert("images/gray-share-3.png"),
        safeTemplateUrlConvert("svgs/gray-question-3.svg"),


        safeTemplateUrlConvert("svgs/gray-layout.svg"),
        safeTemplateUrlConvert("svgs/blue-layout.svg"),
        safeTemplateUrlConvert("svgs/gray-filter.svg"),
        safeTemplateUrlConvert("svgs/blue-filter.svg"),
        safeTemplateUrlConvert("svgs/gray-text.svg"),
        safeTemplateUrlConvert("svgs/blue-text.svg"),
        safeTemplateUrlConvert("svgs/gray-sticker.svg"),
        safeTemplateUrlConvert("svgs/blue-sticker.svg"),
        safeTemplateUrlConvert("svgs/gray-photos.svg"),
        safeTemplateUrlConvert("images/gray-copy.png"),
        safeTemplateUrlConvert("images/left-size-arrow.png"),
        safeTemplateUrlConvert("images/right-size-arrow.png"),
        safeTemplateUrlConvert("images/gray-collapse.png"),
        safeTemplateUrlConvert("images/white-copy.png"),
        safeTemplateUrlConvert("svgs/white-delete.svg")
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
          loadFonts();
          loadImagesAndSvgs();
          // stopDebug();
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
