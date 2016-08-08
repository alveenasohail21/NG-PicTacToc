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
    .directive('pttLayouts', pttLayouts);

  /* @ngInject */
  function pttLayouts($timeout){

    // would be get from server, only active layouts will be shown
    var layouts = [
      {
        name: 'TWO COLUMNS VERTICAL',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 1,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 1,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      },
      {
        name: 'TWO ROWS HORIZONTAL',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 1,
            height: 0.5,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 1,
            height: 0.5,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      },
      {
        name: '1 COLUMN IN 50%, 2 ROWS IN SECOND COLUMN',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 1,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 0.5,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            fill: 'lightpink', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      },
      {
        name: '1 ROW IN 60%, 2 COLUMNS IN HALF HALF',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 1,
            height: 0.6,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.6,
            width: 0.5,
            height: 0.5,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.6,
            width: 0.5,
            height: 0.5,
            fill: 'lightpink', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      },
      {
        name: '4 EQUAL BOXES ',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.5,
            height: 0.5,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0,
            width: 0.5,
            height: 0.5,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            fill: 'lightpink', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.5,
            top: 0.5,
            width: 0.5,
            height: 0.5,
            fill: 'lightgreen', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      },
      {
        name: '3 COLUMN in ONE ROW, 1 ROW BOTTOM',
        url: 'images/sidemenu/layouts/layout-5.png',
        isActive: true,
        data: [
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: 0.33333,
            height: 0.5,
            fill: 'lightpink', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.33333,
            top: 0,
            width: 0.33333,
            height: 0.5,
            fill: 'lightyellow', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0.66666,
            top: 0,
            width: 0.33333,
            height: 0.5,
            fill: 'lightgreen', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          },
          {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0.5,
            width: 1,
            height: 0.5,
            fill: 'cadetblue', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
          }
        ]
      }
    ];

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/layouts.html',
      scope: {
        onSelect: '&onSelect'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      // Initializer
      function init(){
        // TODO: Fetch texts from server
        setupLayouts();
      }

      // setup text
      function setupLayouts(){
        if(layouts.length>0){
          console.log("RUNNING LAYOUTS SETUP: ");
          scope.layouts = layouts;
          loadLayouts();
        }
        else{
          console.log("NO LAYOUT, NO SETUP");
        }
      }

      // load texts
      function loadLayouts(){
        for(var i=0; i<scope.layouts.length; i++){
          (function(){
            var layoutsToLoad = scope.layouts[i];
            console.log("LOADING LAYOUTS: ", layoutsToLoad);

          }());
        }
      }

      // pagination


      // call initializer
      init();

    }

  }

}());
