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

  function userFactory($rootScope, $localStorage, $q, restFactory){

    /* Return Functions */
    return {
      createUserOnServer: createUserOnServer,
      getUserFromServer: getUserFromServer,
      updateUserInServer: updateUserInServer,
      removeUserFromServer: removeUserFromServer,
      createUserInLocal: createUserInLocal,
      getUserFromLocal: getUserFromLocal,
      updateUserInLocal: updateUserInLocal,
      removeUserFromLocal: removeUserFromLocal
    };


    /* Define Fuctions */

    function createUserOnServer() {
      //
    }

    function getUserFromServer() {
      //
      var deffered = $q.defer();
      restFactory.auth.getAuthenticatedUser()
        .then(function (resp){
          if(resp.success){
            deffered.resolve(resp);
          }
          else{
            deffered.reject(resp);
          }
        }, function(err){
          deffered.reject(err);
        });
      return deffered.promise;
    }

    function updateUserInServer() {
      //
    }

    function removeUserFromServer() {
      //
    }

    function createUserInLocal(user) {
      //
      $rootScope.user = user;
    }

    function getUserFromLocal() {
      //
      return $rootScope.user || null;
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