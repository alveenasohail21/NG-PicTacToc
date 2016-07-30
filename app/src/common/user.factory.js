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
      removeUserFromLocal: removeUserFromLocal,
      activeSocialProfilesFromServer: activeSocialProfilesFromServer,
      activeSocialProfiles: activeSocialProfiles,
      removeSocialProfile: removeSocialProfile,
      socialDetails: socialDetails
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
      $rootScope.user = user;
    }

    function getUserFromLocal(){
      return $rootScope.user || null;
    }

    function updateUserInLocal (user){
      for(var obj in user){
        if(user.hasOwnProperty(obj)){
          $rootScope.user[obj] = user[obj];
        }
      }
    }

    function removeUserFromLocal() {
      delete $rootScope.user;
    }

    // get activeSocialProfiles
    function activeSocialProfilesFromServer(){
      var deffered = $q.defer();
      restFactory.users.activeSocialProfiles()
        .then(function(resp){
          console.log(resp);
          if(resp.success){
            // if no social profile
            if(!resp.data){
              resp.data = [];
            }
            updateUserInLocal({activeSocialProfiles: resp.data});
            deffered.resolve(resp.data);
          }
          else{
            // TODO
            deffered.reject(resp);
          }
        }, function(err){
          deffered.reject(err);
        });
      return deffered.promise;
    }

    // get getActiveSocialProfilesFromFactory
    function activeSocialProfiles(){
      if($rootScope.user.activeSocialProfiles){
        return $rootScope.user.activeSocialProfiles;
      }
      else{
        return [];
      }
    }

    // update activeSocialProfiles
    function removeSocialProfile(platform){
      var index = $rootScope.user.activeSocialProfiles.indexOf(platform);
      if(index>=0){
        $rootScope.user.socialName = '';
        $rootScope.user.activeSocialProfiles.splice(index, 1);
      }
      console.log("Active Social Profiles Update: ",$rootScope.user.activeSocialProfiles);
    }

    // get socialDetails
    function socialDetails(){
      var deffered = $q.defer();
      restFactory.users.socialDetails()
        .then(function(resp){
          if(resp.success){
            deffered.resolve(resp.data);
          }
          else{
            // TODO
            deffered.reject(resp);
          }
        }, function(err){
          deffered.reject(err);
        });
      return deffered.promise;
    }


  }

}());