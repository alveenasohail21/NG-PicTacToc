/**
 * @ngdoc service
 * @name app.common.rest
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('restFactory', restFactory);

  /* @ngInject */
  function restFactory(Restangular, $localStorage){

    /* Rest Objects */
    var Users = Restangular.all('users');
    var Auth = Restangular.all('auth');
    var Photos = Restangular.all('photos');

    /* Return Functions */
    return {
      auth: {
        login: login,
        signup: signup,
        getAuthenticatedUser: getAuthenticatedUser,
        forgotEmailSend: forgotEmailSend
      },
      users: {
        create: createUser,
        read: readUser,
        update: updateUser,
        remove: removeUser,
        activeSocialProfiles: activeSocialProfiles,
        socialDetails: socialDetails
      },
      photos: {
        getPhotos: getPhotos,
        getSocialPhotos: getSocialPhotos,
        deletePhoto: deletePhoto
      }
    };

    /* Define Fuctions */

    function login() {
      //
    }

    function signup() {
      //
    }

    function getAuthenticatedUser(){
      return Auth.one('user').get({token: $localStorage.token});
    }

    function forgotEmailSend(email){
      return Auth.one('password').one('forget').post(null, {email: email});
    }

    function createUser(){
      //
    }

    function readUser(){
      //
    }

    function updateUser(){
      //
    }

    function removeUser(){
      //
    }

    function getPhotos(data){
      return Restangular.one('photos').get(data);
    }

    function getSocialPhotos(data){
      //return Photos.one('getSocialPhotos').post(null, {provider: 'facebook'}, {}, {token: $localStorage.token})
    }

    function activeSocialProfiles(){
      return Users.one('social').one('active').get();
    }

    function socialDetails(data){
      return Users.one('social').one('details').get(data);
    }
    function deletePhoto(id){ ////delete selected photo in step 1
       return Restangular.one('photos', id).remove();
    }
  }

}());
