/**
 * @ngdoc overview
 * @name app
 * @description Glue to where all the greatness begins
 */

(function(){

  'use strict';

  angular.module('app', [
    'app.core',
    'app.common',
  /**
    * Application modules
  **/
    'app.auth',
    'app.layouts',
    'app.dashboard'
  ])
    .run(function($rootScope){
      $rootScope.safeTemplateUrlConvert = safeTemplateUrlConvert;
    });

  function safeTemplateUrlConvert(url){
    if(!url){
      return;
    }

    var isLocalhost = (window.location.origin.indexOf('localhost')>=0);

    // Development on Localhost (media serving through node.js)

    // Production
    if(!isLocalhost){
      return 'tool/'+url;
    }

    return url;

  }

  window.safeTemplateUrlConvert = safeTemplateUrlConvert;

}());
