/**
 * @ngdoc controller
 * @name app.auth.controller:Auth
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('app.auth')
		.controller('authCtrl', authCtrl);

  /* @ngInject */
	function authCtrl(authFactory){
		var vm = this;

    vm.init = init;
    vm.login = login;
    vm.signup = signup;

    function init(){
      //
    }

    function login(user){
      //
      authFactory.login(user);
    }

    function signup(user){
      //
      authFactory.signup(user);
    }

	}

}());
