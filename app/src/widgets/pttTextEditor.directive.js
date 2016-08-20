/**
 * Created by Saharcasm on 19-Aug-16.
 */
/**
 * @ngdoc directive
 * @name app.dashboard.directive:lightSlider
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
    .module('app.dashboard')
    .directive('pttTextEditor', pttTextEditor);

  /* @ngInject */
  function pttTextEditor(){
    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/textEditor.html',
      scope: {
        selectedObject: '&'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){
      // Initializer
      console.log("i am here");
      console.log(scope.selectedObject);
      function init(){


      }

      // call initializer
      init();
    }

  }

}());