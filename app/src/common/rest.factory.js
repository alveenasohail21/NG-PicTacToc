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
    var User = Restangular.all('user');
    var Auth = Restangular.all('auth');

    /* Return Functions */
    return {
      auth: {
        login: login,
        signup: signup,
        getAuthenticatedUser: getAuthenticatedUser
      },
      user: {

        create: createUser,
        read: readUser,
        update: updateUser,
        remove: removeUser
      }
    };

    /* Define Fuctions */

    function getAuthenticatedUser(){
      return Auth.one('user').get({token: $localStorage.token});
    }

    function login() {
      //
    }

    function signup() {
      //
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


  }

}());
