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
    .directive('themeCustomizer', themeCustomizer);

  /* @ngInject */
  function themeCustomizer($localStorage){

    return {
      link: link,
      restrict: 'AE'
    };

    /////////////////////

    function link(scope, element, attrs, ngModel){
      var dropdownElement=$('#ptt-dropdown-color');
      var themeBase="ptt-dropdown-color-";
      var initialTheme=$localStorage.theme || 1;
      $localStorage.theme=$localStorage.theme ? $localStorage.theme : 1;

      scope.changeTheme=function(theme){
        dropdownElement.attr('class', themeBase+theme);
        $('#ptt-content-wrapper-2').attr('class', themeBase+theme+'-bg');
        scope.svgImage=theme;
      };
      scope.selectTheme=function(selected){
        $localStorage.theme=selected;
        scope.changeTheme(selected);
      };

      scope.changeTheme(initialTheme);


    }
  }

}());
