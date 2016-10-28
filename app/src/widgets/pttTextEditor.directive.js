/**
 * @ngdoc directive
 * @name app.dashboard.directive:pttTextEditor
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
  function pttTextEditor($timeout){

    // would be get from server, only active filters will be shown
    // normal is always on last

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/textEditor.html',
      scope: {
        selectedObject: '=',
        updateDirective: '='
      }
    };

    /////////////////////
    function link(scope, elem, attrs){

      scope.object = {
        size: 12
      };

      // Initializer
      function init(){
        // TODO: Fetch something from Server
        //$(document).ready(function(){
        //  customizer = $('.text-editor-parent');
        //})
      }

      // setup Text Editor
      function setupTextEditor(){

      }

      // watch any change in selectedObject
      scope.$watch('updateDirective', function(newValue, oldValue){
        // console.log("TEXT EDITOR WATCH EXECUTED: ", newValue, oldValue);
        // console.log(scope.selectedObject);
        //customizer.css('left', scope.selectedObject.left);
      });

      // call initializer
      init();
    }
  }

}());
