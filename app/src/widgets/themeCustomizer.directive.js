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
      console.log('theme :: ',initialTheme);
      //add dark shadows for dark themes
      function addThemeShadow(){
        $('.navbar').addClass('theme-box-shadow');
        $('.step2-lightSlider').addClass('lightSlider-box-shadow');
        $('#ptt-sidebar-wrapper').addClass('theme-box-shadow');
        $('.thumbs-collapse-btn').addClass('theme-box-shadow');
        $('.ptt-sidebar-2-close').addClass('theme-box-shadow');
        $('.sidemenu-filters').addClass('theme-box-shadow');
      }

      //remove dark shadows for light themes
      function removeThemeShadow(){
        $('.navbar').removeClass('theme-box-shadow');
        $('#ptt-sidebar-wrapper').removeClass('theme-box-shadow');
        $('.step2-lightSlider').removeClass('lightSlider-box-shadow');
        $('.ptt-sidebar-2-close').removeClass('theme-box-shadow');
        $('.sidemenu-filters').removeClass('theme-box-shadow');
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


