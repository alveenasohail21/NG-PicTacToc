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
    .directive('pttFilters', pttFilters);

  /* @ngInject */
  function pttFilters($timeout){

    // would be get from server, only active filters will be shown
    //var filters = ['vintage', 'lomo', 'clarity', 'sinCity', 'sunrise', 'nostalgia', 'hemingway', 'grungy', 'jarques', 'pinhole'];
    var filters = ['vintage', 'lomo', 'clarity', 'sinCity', 'sunrise', 'crossProcess', 'orangePeel',
      'love', 'grungy', 'jarques', 'pinhole', 'oldBoot', 'glowingSun', 'hazyDays', 'herMajesty',
      'nostalgia', 'hemingway', 'concentrate', 'normal'];

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/filters.html',
      scope: {
        thumbnail: '=thumbnail',
        onSelect: '&onSelect'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      // Initializer
      function init(){
        // TODO: Fetch filters from server
      }

      // setup filters
      function setupFilters(){
        if(filters){
          console.log("RUNNING FILTERS SETUP: ");
          scope.filters = filters;
          applyFilters();
        }
        else{
          console.log("NO FILTERS, NO SETUP");
        }
      }

      // watch any change in photos
      scope.$watch('thumbnail', function(newValue, oldValue){
        console.log("FILTERS WATCH EXECUTED: ", newValue, oldValue);
        if(scope.thumbnail && 'base64' in scope.thumbnail){
          scope.filters = [];
          $timeout(function(){
            setupFilters();
          }, 200);
        }
      }, true);

      // apply filters
      function applyFilters(){
        for(var i=0; i<filters.length; i++){
          (function(){
            var filterToApply = filters[i];
            Caman('.sidemenu-filters img#'+filterToApply, function () {
              var that = this;
              //that.revert(true);
              console.log("APPLYING FILTER: ",filterToApply);
              switch(filterToApply){
                case'normal':
                  // do nothing
                  break;
                default:
                  that[filterToApply]();
                  break;
              }
              that.render();
            });
          }());
        }
      }

      // call initializer
      init();

    }

  }

}());
