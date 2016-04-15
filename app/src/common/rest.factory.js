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
  function restFactory(Restangular){

    /* Rest Objects */
    var User = Restangular.all('user');

    /* Return Functions */
    return {
      login: login,
      signup:signup,
      user: {
        create: createUser,
        read: readUser,
        update: updateUser,
        remove: removeUser
      }
    };

    /* Define Fuctions */
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
