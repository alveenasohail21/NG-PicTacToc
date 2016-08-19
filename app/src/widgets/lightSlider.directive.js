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
    .directive('pttPhotoStrip', pttPhotoStrip);

  /* @ngInject */
  function pttPhotoStrip($timeout, uploadSliderConfig, $rootScope, $state, alertFactory){

    var sliderHtml;
    var availableSliders = ['step1-lightSlider', 'step2-lightSlider'];

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'src/dashboard/layouts/lightSlider.html',
      scope: {
        photos: '=photos',
        showUploadImage: '=showUploadImage',
        step: '@step',
        onDelete: '&onDelete',
        onSelect: '&onSelect',
        onSelectFiles: '&onSelectFiles',
        onToggleExpandView: '&onToggleExpandView',
        onGetSelectPhoto: '&onGetSelectPhoto'
      }
    };

    /////////////////////

    function link(scope, elem, attrs){

      var sliderId = '#'+availableSliders[scope.step-1];
      var sliderClass = '.'+availableSliders[scope.step-1];

      // Initializer
      function init(){
        $(document).ready(function() {
          $timeout(function(){
            setupSlider();
          }, 200);
          $(window).resize(function(){
            $timeout(function(){
              setupSlider();
            }, 200);
          });
        });
      }

      // setup slider
      function setupSlider(){
        console.log("RUNNING LIGHT SLIDER SETUP: ", sliderId);

        sliderHtml = $(sliderId).lightSlider(uploadSliderConfig);

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.left-arrow').off('click');
        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.right-arrow').off('click');

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.left-arrow').click(function(){
          sliderHtml.goToPrevSlide();
          console.log("CURRENT SLIDE: ", sliderHtml.getCurrentSlideCount());
        });

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.right-arrow').click(function(){
          sliderHtml.goToNextSlide();
          console.log("CURRENT SLIDE: ", sliderHtml.getCurrentSlideCount());
        });
      }

      // watch any change in photos
      scope.$watch('photos', function(newValue, oldValue){
        if(scope.photos.length < $rootScope.imageConstraints.minPhotoForProduct && $state.current!='Dashboard.Prints.Design'){
          console.log("< 5 photos");
          alertFactory.warning(null, "You need to have at least 5 photos in order to proceed");
          $state.go('^.Upload',{reload: true});
        }
        console.log("LIGHT SLIDER WATCH EXECUTED: ", newValue, oldValue);
        if(sliderHtml){
          console.log("REFRESHING LIGHT SLIDER");
          setupSlider();
          if((newValue.length - oldValue.length)==1){
           $timeout(function(){
             for(var i=sliderHtml.getCurrentSlideCount(); i<scope.photos.length;i++){
               sliderHtml.goToNextSlide();
             }
           },200)
          }
        }

      }, true);

      // logout
      $rootScope.$on('logout', function(event, args){
        scope.photos = [];
        console.log("REMOVED FROM DIRECTIVE", scope.photos);
      });

      // call initializer
      init();

    }

  }

}());
