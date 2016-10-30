/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('orderFactory', orderFactory);

  function orderFactory($q, restFactory, alertFactory){

    const DefaultItemImageSize = '260x260';

    /* Return Functions */
    return {
      placeOrder: placeOrder
    };

    /* Define Fuctions */

    function placeOrder(projectId, items){
      var deferred = $q.defer();
      globalLoader.show();
      var data = {
        project_id: projectId,
        items: items
      };
      restFactory.orders.placeOrder(data)
        .then(function(resp){
          if(resp.success){
            alertFactory.success(null , resp.message);
            deferred.resolve(resp);
          }
          else{
            alertFactory.error(null, resp.message);
            deferred.reject(resp);
          }
          globalLoader.hide();
        }, function(err){
          alertFactory.error(null, err.data.message);
          globalLoader.hide();
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
}());
