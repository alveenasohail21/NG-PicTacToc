/**
 * @ngdoc service
 * @name app.common.alert
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('alertFactory', alertFactory);

  function alertFactory($rootScope, $timeout){

    /* Variables */
    var alert = {
      title: "Success!",
      message: "You are landed at the right spot.",
      show: false,
      class: "alert-success"
    };

    $rootScope.alert = alert;

    /* Return Functions */
    return {
      success: success,
      error: error
    };


    /* Define Fuctions */
    function success(title, message) {
      $rootScope.alert.class = 'alert-success';
      $rootScope.alert.title = title || 'Success: ';
      $rootScope.alert.message = message;
      $rootScope.alert.show = true;
      removeAlert(3000);
    }

    function error(title, message) {
      $rootScope.alert.class = 'alert-danger';
      $rootScope.alert.title = title || 'Error: ';
      $rootScope.alert.message = message;
      $rootScope.alert.show = true;
      removeAlert(3000);
    }

    function removeAlert(time){
      $timeout(function(){
        $rootScope.alert.show = false;
        $rootScope.alert.class = '';
      }, time)
    }

  }

}());
