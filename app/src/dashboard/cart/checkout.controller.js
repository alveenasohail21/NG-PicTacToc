/**
 * @ngdoc controller
 * @name app.welcome.controller:Welcome
 * @description Welcome controller which typically is useless and you are going to delete it
 */

(function(){

  'use strict';

  angular.module('app.dashboard')
    .controller('checkoutCtrl', checkoutCtrl);

  /* @ngInject */
  function checkoutCtrl($rootScope, orderFactory, userFactory, websiteFactory){

    var vm = this;

    /* Variables */

    vm.isShippingDetailPresent = false;
    vm.editShippingDetails = false;

    vm.placeOrder = placeOrder;
    vm.editDetails = editDetails;
    vm.confirmShipping = confirmShipping;

    /* Define Functions */

    function init(){
      eventChannel.on('placeOrder', function(){

        getUserShippingDetails();

      })
    }

    function openConfirmOrderModal(){
      $('#confirmOrderModal').modal({
        keyboard: true
      });
    }

    function getUserShippingDetails(){
      globalLoader.show();
      userFactory.getUserShippingDetails().then(function (response) {
        if(response){
          vm.isShippingDetailPresent = true;
          vm.shippingDetails = response;
          globalLoader.hide();
          openConfirmOrderModal();
        }
        else{
          vm.isShippingDetailPresent = false;
        }
      });
    }

    function confirmShipping(){
      userFactory.putUserShippingDetails(vm.shippingDetails)
        .then(function (resp) {
          if(resp){
            vm.isShippingDetailPresent = true;
            vm.editShippingDetails = false;
          }
      });
    }

    function editDetails(){
      vm.editShippingDetails = !vm.editShippingDetails;
    }

    function placeOrder(){
      orderFactory.placeOrder($rootScope.sku, vm.items)
        .then(function(resp){
          // TODO: show success in modal
          if(resp.success){
            websiteFactory.goToOrderHistory(resp.data.order_id);
          }
        })
    }

    init();

  }

}());
