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
  function webappStep3Ctrl(cartFactory, $timeout, $rootScope, $state, websiteFactory, orderFactory){

    console.log("CONTROLLER STEP 3");

    var vm = this;

    /* Variables */
    vm.editOrder = false;
    vm.items = cartFactory._data.projectItems;
    vm.list = [];
    vm.listItem = {};
    vm.selectedSize = null;

    vm.nextStep = nextStep;
    vm.selectSize = selectSize;
    vm.toggleEditMode = toggleEditMode;
    vm.showSummaryMode = showSummaryMode;
    vm.showEditMode = showEditMode;
    vm.gotoProjects = gotoProjects;
    vm.logout = logout;
    vm.continueDesign = continueDesign;
    vm.proceedToCheckout = proceedToCheckout;

    /* Define Functions */

    function init(){
      console.log(vm.items);
      prepareLists();
    }

    function prepareLists(){
      for(var i=0; i<vm.items.length; i++){
        if(vm.list.indexOf(vm.items[i].canvasSizeDetails.dimensions.title.inches) < 0){
          vm.list.push(vm.items[i].canvasSizeDetails.dimensions.title.inches);
          vm.listItem[vm.items[i].canvasSizeDetails.dimensions.title.inches] = [];
          vm.listItem[vm.items[i].canvasSizeDetails.dimensions.title.inches].push(vm.items[i]);
        }
        else{
          vm.listItem[vm.items[i].canvasSizeDetails.dimensions.title.inches].push(vm.items[i]);
        }
      }
    }

    function selectSize(list){
        vm.selectedSize = list;
        toggleEditMode(vm.selectedSize);
    }

    function toggleEditMode(listType){
      if(!listType){
        vm.selectedSize = null;
      }
      globalLoader.show();
      $timeout(function(){
        vm.editOrder = !vm.editOrder;
        globalLoader.hide();
      }, 1500);
    }

    function showEditMode(){
      vm.selectedSize = null;
      vm.editOrder = true;
    }

    function showSummaryMode(){
      vm.editOrder = false;
    }

    function nextStep(stateName){

      if(stateName == 'PlaceOrder'){
        proceedToCheckout();
        return;
      }

      var isLocalhost = (window.location.origin.indexOf('localhost') >= 0);
      var params = (isLocalhost)?({sku: $rootScope.sku}):null;
      // go to state
        $state.go(stateName, params);
    }

    function proceedToCheckout(){

      // attach project to $rootScope for the modal to use it
      $rootScope.order = {
        'projectId': $rootScope.sku,
        'items': vm.items
      };

      eventChannel.fire('placeOrder');

    }

    function continueDesign(){
      nextStep('Design');
    }

    function gotoProjects() {
      websiteFactory.gotoProjects();
    }

    function logout() {
      websiteFactory.logout();
    }

    init();

  }

}());
