/**
 * @ngdoc controller
 * @name app.welcome.controller:Welcome
 * @description Welcome controller which typically is useless and you are going to delete it
 */

(function(){

  'use strict';

  angular.module('app.dashboard')
    .controller('webappStep3Ctrl', webappStep3Ctrl);

  /* @ngInject */
  function webappStep3Ctrl(r_product){

    console.log("CONTROLLER STEP 3");

    var vm = this;

    /* Variables */
    vm.products = r_product;

    console.log(vm.products);

  }

}());
