/**
 * @ngdoc overview
 * @name app.common
 * @description Host of all the cross cutting source
 */

(function(){

  'use strict';

  angular.module('app.common', [

  ])
    .run(function($rootScope, FRONT_END_MEDIA_DEV_URL){

      $rootScope.safeUrlConvert = safeUrlConvert;

      // helper $rootScope methods

      function safeUrlConvert(url){

        // if default image
        if(url.indexOf('svg/logo-icon.svg') >= 0){
          return url;
        }

        // else

        var isLocalhost = window.location.origin.indexOf('localhost');

        // Development on Localhost (media serving through node.js)
        if(isLocalhost){
          var index = url.indexOf('/media');
          var updatedUrl = FRONT_END_MEDIA_DEV_URL+url.substring(index)+'?t='+(new Date()).getSeconds();
          return updatedUrl;
        }

        // Production
        else{
          return url;
        }

      }

    })

}());
