/**
 * @ngdoc overview
 * @name app.common
 * @description Host of all the cross cutting source
 */

(function(){

  'use strict';

  angular.module('app.core')
    .value('uploadSliderConfig',
      {
        loop: false,
        slideMove: 1,
        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        speed: 800,
        pager: false,
        controls: false,
        mode: 'slide',
        responsive: [
          {
            breakpoint: 4000,
            settings: {
              item: 12
            }
          },
          {
            breakpoint: 1980,
            settings: {
              item: 12
            }
          },
          {
            breakpoint: 1740,
            settings: {
              item: 9
            }
          },
          {
            breakpoint: 1400,
            settings: {
              item: 8
            }
          },
          {
            breakpoint: 1280,
            settings: {
              item: 6
            }
          },
          {
            breakpoint: 1024,
            settings: {
              item: 5
            }
          },
          {
            breakpoint: 800,
            settings: {
              item: 4
            }
          }
        ]
      }
    );

}());
