/**
 * @ngdoc directive
 * @name app.components.directive:photo
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
        .directive('cartProjectDirective', cartProjectDirective);

    /* @ngInject */
    function cartProjectDirective($timeout, $rootScope){
        return {
            link: link,
            restrict: 'E',
            templateUrl: 'src/dashboard/layouts/cart-project.html',
            replace: true,
            scope:{
                project: '='

            }
        };

        /////////////////////

        function link(scope, elem, attrs){
          scope.placeOrder=placeOrder;
          function placeOrder() {
            $rootScope.order = {
              'projectId': scope.project._id,
              'items': scope.project.items
            };
            eventChannel.fire('placeOrder');
          }

            function convertUrl() {
                var url=scope.project.items[0].url;
                var extension=scope.project.items[0].extension;
                var dimension="260x260";
                // scope.url=$rootScope.safeUrlConvert(url+"-"+dimension+"."+extension);
                scope.url=$rootScope.safeUrlConvert(url);
            }
            function init(){
                convertUrl();
            }
            init();

        }
    }

}());
