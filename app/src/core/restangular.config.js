/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for restangular
 */

(function(){

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration(RestangularProvider, API_URL){

    RestangularProvider.setBaseUrl(API_URL);
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});

  }

}());
