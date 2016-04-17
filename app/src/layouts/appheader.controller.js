/**
 * @ngdoc controller
 * @name app.layouts.controller:AppHeader
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('app.layouts')
		.controller('appHeaderCtrl', appHeaderCtrl);

  /* @ngInject */
	function appHeaderCtrl(authFactory){
		var vm = this;

    vm.logout = logout;

    function logout(){
      authFactory.logout();
    }

	}

}());
