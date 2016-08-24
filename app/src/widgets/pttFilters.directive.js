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
    // normal is always on last
    var filters =[
      { name: 'vintage', selected: false },
      { name: 'lomo', selected: false },
      //{ name: 'clarity', selected: false },
      { name: 'sinCity', selected: false },
      { name: 'sunrise', selected: false },
      { name: 'crossProcess', selected: false },
      { name: 'orangePeel', selected: false },
      { name: 'love', selected: false },
      { name: 'grungy', selected: false },
      { name: 'jarques', selected: false },
      { name: 'pinhole', selected: false },
      { name: 'oldBoot', selected: false },
      { name: 'glowingSun', selected: false },
      //{ name: 'hazyDays', selected: false },
      { name: 'herMajesty', selected: false },
      { name: 'nostalgia', selected: false },
      { name: 'hemingway', selected: false },
      //{ name: 'concentrate', selected: false },
      { name: 'normal', selected: false }
    ];
    // {name: 'vintage', selected: false}
    var activeFilterIndex = null;

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

      scope.selectedFilter = selectedFilter;
      scope.showFilterLoader=[];

      // Initializer
      function init(){
        // TODO: Fetch filters from server
      }
      // setup filters
      function setupFilters(){
        if(filters){
          console.log("RUNNING FILTERS SETUP: ");
          scope.filters = filters;
          scope.filters.forEach(function(obj){
            obj.selected = false;
          });
          // by default normal is applied
          scope.filters[scope.filters.length-1].selected = true;
          activeFilterIndex = scope.filters.length-1;
          //
          $timeout(function(){
            applyFilters();
          }, 200);
        }
        else{
          console.log("NO FILTERS, NO SETUP");
        }
      }

      // watch any change in photos
      scope.$watch('thumbnail', function(newValue, oldValue){
        console.log("FILTERS WATCH EXECUTED: ", newValue, oldValue);
        if(scope.thumbnail && 'base64' in scope.thumbnail){
          // scope.filters = [];
          $timeout(function(){
            setupFilters();
          }, 1000);
        }
      }, true);

      scope.$watch('showFilterLoader', function(newValue, oldValue){
        console.log("value changed");
      }, true);

      // apply filters
      function applyFilters(){
        for(var i=0; i<filters.length; i++){
          (function(){
            var filterToApply = filters[i].name;
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

      function disableLoader(filter){
        console.log("IN DIRECTIVE: ", filter);
        scope.$apply(function(){
          scope.filters[activeFilterIndex].showLoader = false;
        })
      }

      function selectedFilter(filter, index) {
        // remove old selected filter
        // class will be applied automatically
        if(activeFilterIndex!=undefined && activeFilterIndex>=0){
          scope.filters[activeFilterIndex].selected = false;
          // add new loader
          scope.filters[activeFilterIndex].showLoader = false;
        }
        if(index == activeFilterIndex){
          scope.filters[index].selected = false;
          // add new loader
          scope.filters[activeFilterIndex].showLoader = true;
          scope.onSelect({filter: 'normal', cb: disableLoader});
          scope.filters[scope.filters.length-1].selected = true;
          activeFilterIndex = scope.filters.length-1;
        }
        else{
          activeFilterIndex = index;
          scope.filters[index].selected = true;
          // add new loader
          scope.filters[activeFilterIndex].showLoader = true;
          scope.onSelect({filter: filter.name, cb: disableLoader});
        }
      }

      // call initializer
      init();
    }
  }

}());
