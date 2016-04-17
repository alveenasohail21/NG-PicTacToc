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
    .directive('compareTo', compareTo);

  /* @ngInject */
  function compareTo(){

    return {
      require: 'ngModel',
      link: link,
      scope: {
        otherModelValue: '=compareTo'
      }
    };

    /////////////////////

    function link(scope, elem, attrs, ngModel){
      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  }

}());
