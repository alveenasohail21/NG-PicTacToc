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
  function pttFilters($timeout,restFactory){

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
    var defaultQuery = {
      type : 'filter',
      from : 0,
      size : 12,
      all : false
    };
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

      // Initializer
      function init(){
        // TODO: Fetch filters from server
        getFiltersFromServer();
        bindLoadMoreStickers();
      }
      function getFiltersFromServer() {
        restFactory.media.get(defaultQuery).then(function (resp) {
          filters = resp.data;
        })
      }
      // Pagination
      function bindLoadMoreStickers(){
        var stickerDiv = angular.element('.sidemenu-filters');
        stickerDiv.scroll(function(){
          var offset = 20;
          var stickerDivHeight = stickerDiv.height();
          var scrollBottom = stickerDiv.scrollTop() + stickerDivHeight + offset;
          var stickerDivScrollHeight = stickerDiv[0].scrollHeight;
          if(scrollBottom >= stickerDivScrollHeight ){
            // console.log("fetching more images");
            loadMoreStickers();
          }
        });
      }

      function loadMoreStickers() {
        var data = defaultQuery;
        data.from += 12;
        restFactory.media.get(data).then(function (resp) {
          filters.push.apply(filters,resp.data);
          setupFilters();
        })
      }

      // setup filters
      function setupFilters(){
        if(filters){
          var filterFound = false;
          // console.log("RUNNING FILTERS SETUP: ");
          scope.filters = filters;
          // update filter images
          scope.filters.forEach(function(obj, index){
            obj.selected = false;
            // remove old filter canvas (all)
            $('canvas#'+obj.name).remove();
            // add img tag
            var img = new Image();
            img.onload = function() {
              $(img).attr('id', obj.name);
              $($('.sidemenu-filters .filter')[index]).prepend(img);
            };
            img.src = scope.thumbnail.base64;
            if(scope.filters[index].name == scope.thumbnail.currentFilter){
              scope.filters[index].selected = true;
              activeFilterIndex = index;
              filterFound = true;
            }
            else{
              if(index == scope.filters.length-1 && !filterFound){
                // by default normal is applied
                scope.filters[scope.filters.length-1].selected = true;
                activeFilterIndex = scope.filters.length-1;
              }
            }
          });
            applyFilters();
        }
        else{
          // console.log("NO FILTERS, NO SETUP");
        }
      }

      // watch any change in photos
      scope.$watch('thumbnail', function(newValue, oldValue){
        // console.log("FILTERS WATCH EXECUTED: ", newValue, oldValue);
        if(scope.thumbnail && 'base64' in scope.thumbnail){
          // scope.filters = [];
          setupFilters();
        }
      }, true);

      // apply filters
      function applyFilters(){
        for(var i=0; i<filters.length; i++){
          (function(){
            var filterToApply = filters[i].name;
            //if($('.sidemenu-filters img#'+filterToApply).length <= 0 ){
            //  return;
            //}
            Caman('.sidemenu-filters img#'+filterToApply, function () {
              var that = this;
              //that.revert(true);
              // console.log("APPLYING FILTER: ",filterToApply);
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
        scope.$apply(function(){
          scope.filters[activeFilterIndex].showLoader = false;
        })
      }

      function selectedFilter(filter, index) {
        // remove old selected filter
        // class will be applied automatically
        if(activeFilterIndex!=undefined && activeFilterIndex>=0){
          scope.filters[activeFilterIndex].selected = false;
          scope.filters[activeFilterIndex].showLoader = false;
        }
        if(index == activeFilterIndex){
          scope.filters[index].selected = false;
          scope.filters[index].showLoader = false;
          scope.onSelect({filter: 'normal', cb: disableLoader});
          scope.filters[scope.filters.length-1].selected = true;
          activeFilterIndex = scope.filters.length-1;
        }
        else{
          activeFilterIndex = index;
          scope.filters[index].selected = true;
          scope.filters[activeFilterIndex].showLoader = true;
          scope.onSelect({filter: filter.name, cb: disableLoader});
        }
      }

      // call initializer
      init();
    }
  }

}());
