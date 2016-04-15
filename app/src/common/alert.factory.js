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
      show: true,
      class: "alert-success"
    };

    $rootScope.alert = alert;

    /* Return Functions */
    return {
      success: success,
      error: error
    };


    /* Define Fuctions */
    function success(title, message, type) {
      //
      $rootScope.alert.class = type;
      $rootScope.alert.title = title;
      $rootScope.alert.message = message;
      removeAlert(3000);
    }

    function error() {
      //
      removeAlert(3000);
    }

    function removeAlert(time){
      $timeout(function(){
        $rootScope.alert.show = false;
      }, time)
    }

  }

}());