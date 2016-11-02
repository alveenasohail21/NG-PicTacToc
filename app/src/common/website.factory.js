/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('websiteFactory', websiteFactory);

  function websiteFactory(FRONT_END_WEBSITE_DEV_URL, FRONT_END_WEBSITE_PROD_URL, authFactory){



    /* Return Functions */
    return {
      gotoProjects: gotoProjects,
      logout: logout,
      help: help,
      goToOrderHistory: goToOrderHistory
    };

    function gotoProjects () {
      var projectUrl = (window.location.origin.indexOf('localhost')>=0)?
        (FRONT_END_WEBSITE_DEV_URL+'/#/account/projects')
        :(FRONT_END_WEBSITE_PROD_URL+'/#/account/projects');
      window.location = projectUrl;
    }

    function logout () {
      var logoutUrl = (window.location.origin.indexOf('localhost')>=0)?
        (FRONT_END_WEBSITE_DEV_URL+'/#/account/logout')
        :(FRONT_END_WEBSITE_PROD_URL+'/#/account/logout');
      authFactory.logout();
      window.location = logoutUrl;
    }

    function help() {
      var helpUrl = (window.location.origin.indexOf('localhost')>=0)?
        (FRONT_END_WEBSITE_DEV_URL+'/#/help')
        :(FRONT_END_WEBSITE_PROD_URL+'/#/help');
      window.location = helpUrl;
    }

    function goToOrderHistory(orderId) {
      var orderHistoryUrl = (window.location.origin.indexOf('localhost')>=0)?
        (FRONT_END_WEBSITE_DEV_URL+'/#/account/orders?oid='+orderId)
        :(FRONT_END_WEBSITE_PROD_URL+'/#/account/orders?oid='+orderId);
      window.location = orderHistoryUrl;
    }


    /* Define Functions */


  }
}());
