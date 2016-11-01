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
    vm.list = [];
    vm.listItems = {};
    vm.total = {
      quantity: 0,
      price: 0
    };

    vm.placeOrder = placeOrder;
    vm.editDetails = editDetails;
    vm.confirmShipping = confirmShipping;
    // vm.calcTotalPrice = calcTotalPrice;

    /* Define Functions */

    function init(){
      eventChannel.on('placeOrder', function(){

        vm.isShippingDetailPresent = false;
        vm.editShippingDetails = false;
        vm.list = [];
        vm.listItems = {};
        vm.total = {
          quantity: 0,
          price: 0
        };
        getUserShippingDetails();

      })
    }

    function openConfirmOrderModal(){
      $('#confirmOrderModal').modal({
        keyboard: true
      });
      prepareList();
      calculateTotalPrice();
    }

    function prepareList(){
      console.log($rootScope.order.items);
      for(var i=0; i<$rootScope.order.items.length; i++){
        if(vm.list.indexOf($rootScope.order.items[i].canvasSizeDetails.dimensions.title.inches)<0){
          var title = $rootScope.order.items[i].canvasSizeDetails.dimensions.title.inches;
          vm.list.push(title);
          vm.listItems[title] = {
            title: title,
            quantity: $rootScope.order.items[i].quantity,
            unit_price: $rootScope.order.items[i].unit_price,
            total_price: $rootScope.order.items[i].total_price
          };
        }
        else{
          var title = $rootScope.order.items[i].canvasSizeDetails.dimensions.title.inches;
          vm.listItems[title].quantity += $rootScope.order.items[i].quantity;
          vm.listItems[title].total_price += $rootScope.order.items[i].total_price;
        }
      }
    }

    function calculateTotalPrice(){
      for (var dimension in vm.listItems) {
        if (vm.listItems.hasOwnProperty(dimension)) {
          vm.total.price += vm.listItems[dimension].total_price;
          vm.total.quantity += vm.listItems[dimension].quantity;
        }
      }
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
      orderFactory.placeOrder($rootScope.order.projectId, $rootScope.order.items)
        .then(function(resp){
          // TODO: show success in modal
          if(resp.success){
            // websiteFactory.goToOrderHistory(resp.data.order_id);
          }
        })
    }

    init();

  }

}());
