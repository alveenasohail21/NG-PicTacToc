/**
 * @ngdoc directive
 * @name app.common.directive:compareTo
 * @scope true
 * @param {object} test test object
 * @restrict E
 *
 * @description < description placeholder >
 *
 */

(function(){

  'use strict';

  angular
    .module('app.common')
    .directive('cartItem', cartItem);

  /* @ngInject */
  function cartItem($rootScope, cartFactory){

    const MaxItemQuantity = 5;
    const MinItemQuantity = 1;

    return {
      link: link,
      replace: true,
      templateUrl: 'src/dashboard/layouts/cartItem.html',
      scope: {
        item: '=item'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      scope.incrementQuantity = incrementQuantity;
      scope.decrementQuantity = decrementQuantity;

      function incrementQuantity(){
        if(scope.item.quantity < MaxItemQuantity){
          cartFactory.updateProjectItemQuantity(scope.item.item_id, scope.item.quantity+1);
        }
      }

      function decrementQuantity(){
        if(scope.item.quantity > MinItemQuantity){
          cartFactory.updateProjectItemQuantity(scope.item.item_id, scope.item.quantity-1);
        }
      }

    }

  }

}());
