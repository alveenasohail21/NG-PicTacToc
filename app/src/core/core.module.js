/**
 * @ngdoc overview
 * @name app.core
 * @description Core is where the Magma is
 */

(function(){

  'use strict';

  angular.module('app.core', [
    'ui.router',
    'restangular',
    'ngStorage',
    'ngMessages',
    'satellizer'
  ])
    .run(function(){

      jQuery(document).ready(function() {

        /*
         Fullscreen background
         */
        $.backstretch("images/backgrounds/1.jpg");

        $('#top-navbar-1').on('shown.bs.collapse', function(){
          $.backstretch("resize");
        });
        $('#top-navbar-1').on('hidden.bs.collapse', function(){
          $.backstretch("resize");
        });

        /*
         Form validation
         */
        $('.registration-form input[type="text"], .registration-form textarea').on('focus', function() {
          $(this).removeClass('input-error');
        });

        $('.registration-form').on('submit', function(e) {

          $(this).find('input[type="text"], textarea').each(function(){
            if( $(this).val() == "" ) {
              e.preventDefault();
              $(this).addClass('input-error');
            }
            else {
              $(this).removeClass('input-error');
            }
          });

        });


      });

    })

}());
