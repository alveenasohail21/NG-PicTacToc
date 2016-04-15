/**
 * Created by Shahnawaz Ali on 2/20/2016.
 */
(function () {

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration($localStorageProvider) {
    // use the HTML5 History API
//    $locationProvider.html5Mode(true);
  }

}());
