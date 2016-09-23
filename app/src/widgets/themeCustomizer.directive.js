/**
 * @ngdoc directive
 * @name app.common.directive:themeCustomizer
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
  function themeCustomizer($localStorage,$timeout){

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
      //add dark shadows for dark themes
      function addThemeShadow(){
        $('.navbar').addClass('theme-shadow');
        $('.step2-lightSlider').addClass('lightSlider-shadow');
        $('#ptt-sidebar-wrapper').addClass('sidebar-shadow');
        $('.ptt-sidebar-content-2').addClass('sidebar-shadow');
        $('.thumbs-collapse-btn').addClass('button-shadow');
        $('.ptt-sidebar-2-close').addClass('sidebar-close-shadow');
        $('.sidemenu-filters').addClass('sidebar-shadow');
      }

      //remove dark shadows for light themes
      function removeThemeShadow(){
        $('.navbar').removeClass('theme-shadow');
        $('#ptt-sidebar-wrapper').removeClass('sidebar-shadow');
        $('.thumbs-collapse-btn').removeClass('button-shadow');
        $('.step2-lightSlider').removeClass('lightSlider-shadow');
        $('.ptt-sidebar-2-close').removeClass('sidebar-close-shadow');
        $('.ptt-sidebar-content-2').removeClass('sidebar-shadow');
        $('.sidemenu-filters').removeClass('sidebar-shadow');
      }

      //check if the theme is light
      function lightTheme(theme){
        return theme != 1;
      }

      //main changing theme event
      function changeTheme(theme){
        dropdownElement.attr('class', themeBase+theme);
        $('#ptt-content-wrapper-2').attr('class', themeBase+theme+'-bg');
        lightTheme(theme) ?  addThemeShadow() : removeThemeShadow() ;
        scope.svgImage=theme;
      }

      //triggers theme change on selection
      scope.selectTheme = function(selected){
        $localStorage.theme=selected;
        changeTheme(selected);
      };

      $timeout(function(){
        changeTheme(initialTheme)
      },300)
    }
  }
}());


