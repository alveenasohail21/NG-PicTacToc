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
	function authCtrl(authFactory, $scope){
		var vm = this;

    vm.forget = {
      email: null
    };

    vm.init = init;
    vm.login = login;
    vm.signup = signup;
    vm.socialAuthenticate = socialAuthenticate;
    vm.forgotEmailSend = forgotEmailSend;

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

    function socialAuthenticate(provider){
      //
      authFactory.socialAuthenticate(provider);
    }

    function forgotEmailSend(email){
      //$('#pwdModal').on('hidden.bs.modal', function(e){
      //  $scope.forgotForm.$setPristine();
      //  $scope.forgotForm.$setUntouched();
      //  // in my case I had to call $apply to refresh the page, you may also need this.
      //  $scope.$apply();
      //})
      if(email){
        authFactory.forgotEmailSend(email)
          .then(function(resp){
            if(resp.success){
              vm.forget.email = '';
              $('#pwdModal').modal('hide');
            }
          })
      }
    }

	}

}());
