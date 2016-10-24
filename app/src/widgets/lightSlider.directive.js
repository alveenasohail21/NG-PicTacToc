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

      const DefaultFilterImageSize = '260x260';

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

        scope.convertUrl = convertUrl;

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
        // console.log("RUNNING LIGHT SLIDER SETUP: ", sliderId);
        sliderHtml = $(sliderId).lightSlider(uploadSliderConfig);

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.left-arrow').off('click');
        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.right-arrow').off('click');

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.left-arrow').click(function(){
          sliderHtml.goToPrevSlide();
          // console.log("CURRENT SLIDE: ", sliderHtml.getCurrentSlideCount());
        });

        $('.ptt-lightSlider' + sliderClass + ' .custom-svg-icon.right-arrow').click(function(){
          sliderHtml.goToNextSlide();
          // console.log("CURRENT SLIDE: ", sliderHtml.getCurrentSlideCount());
        });

        $('.ptt-lightSlider').css('opacity', 1);

        registerSliderEvents();
      }

      // watch any change in photos
      scope.$watch('photos', function(newValue, oldValue){
        if(scope.photos.length < $rootScope.imageConstraints.minPhotoForProduct && $state.current.name!='Dashboard.Prints.Design'){
          // console.log("< "+ $rootScope.imageConstraints.minPhotoForProduct +" photos");
          alertFactory.warning(null, "You need to have at least "+ $rootScope.imageConstraints.minPhotoForProduct +" photo[s] in order to proceed");
          $state.go('^.Upload',{reload: true});
        }
        // console.log("LIGHT SLIDER WATCH EXECUTED: ", newValue, oldValue);
        if(sliderHtml && newValue.length != oldValue.length){
          var addition = (newValue.length - oldValue.length) == 1;
          var deletion = (newValue.length - oldValue.length) == -1;

          // console.log("REFRESHING LIGHT SLIDER");
          setupSlider();

          // Prints Step 1
          if($state.current.name == 'Dashboard.Prints.Upload'){
            if(addition){
              // console.log("STEP 1 - Addition");
              $timeout(function(){
                for(var i=sliderHtml.getCurrentSlideCount(); i<scope.photos.length;i++){
                  sliderHtml.goToNextSlide();
                }
              },200)
            }
            else if(deletion){
              // console.log("STEP 1 - Deletion");
              // TODO
            }
          }
          // Prints Step 2
          else if($state.current.name == 'Dashboard.Prints.Design'){
            if(addition){
              // console.log("STEP 2 - Addition");
              // TODO
            }
            else if(deletion){
              // console.log("STEP 2 - Deletion");
              // TODO
            }
          }
        }

      }, true);

      // logout
      $rootScope.$on('logout', function(event, args){
        scope.photos = [];
        // console.log("REMOVED FROM DIRECTIVE", scope.photos);
      });

      function registerSliderEvents() {
        //handles events on the lightslider photos
        $('ul#step2-lightSlider img').off('dragend');
        $('ul#step2-lightSlider img').on('dragend', function(ev){
          ev.preventDefault();
          scope.onGetSelectPhoto({
            id: ev.target.dataset.photoid,
            index: ev.target.dataset.index,
            imageDragged: true
          });
        });

      }

        function convertUrl(photo){
            if(photo.isProduct){
                return photo.url;
            }
            return photo.url+ '-' + DefaultFilterImageSize + '.' + photo.extension;
        }

      // call initializer
      init();

    }

  }

}());
