/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('userFactory', userFactory);

  function userFactory($rootScope, $localStorage, $q){

    /* Return Functions */
    return {
      create: create,
      read: read,
      update: update,
      remove: remove,
      saveUserToLocal: saveUserToLocal,
      getUserFromLocal: getUserFromLocal,
      updateUserInLocal: updateUserInLocal,
      removeUserFromLocal: removeUserFromLocal
    };


    /* Define Fuctions */
    function create() {
      //
    }

    function read() {
      //
    }

    function update() {
      //
    }

    function remove() {
      //
    }

    function saveUserToLocal(user) {
      //
      $rootScope.user = user;
    }

    function getUserFromLocal() {
      //
      return $rootScope.user;
    }

    function updateUserInLocal (user){
      //
      for(var obj in user){
        if(user.hasOwnProperty(obj)){
          $rootScope.user[obj] = user[obj];
        }
      }
    }

    function removeUserFromLocal() {
      //
      delete $rootScope.user;
    }

  }

}());