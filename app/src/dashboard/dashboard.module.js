/**
 * @ngdoc overview
 * @name app.dashboard
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.dashboard', [])
    .config(configuration);

  /* @ngInject */
  function configuration($stateProvider){

    //add your state mappings here
    $stateProvider
      .state('Dashboard', {
        url:'/dashboard',
        templateUrl:'src/dashboard/dashboard.html',
        controller: 'dashboardCtrl as vm'
      }
    );
  }

}());
