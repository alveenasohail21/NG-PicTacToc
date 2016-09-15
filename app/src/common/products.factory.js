(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('productsFactory', productsFactory);


  function productsFactory($q, restFactory, alertFactory){
    return {
      addInProgressProducts : addInProgressProducts,
      copyProduct: copyProduct
    };

    function addInProgressProducts(data) {
      var deffered = $q.defer();
      restFactory.products.addInProgressProducts(data).then(function (resp) {
        alertFactory.success(null, resp.message);
        deffered.resolve(resp.data);
      },function (err) {
        alertFactory.error(null, resp.message);
        deffered.reject(resp);
      })

    }

    function productToPostDataMapper(canvasObject) {
      var data = {
        photoid : canvasObject.id,
        canvasDataUrl : canvasObject.canvasDataUrl,
        canvasJSON : canvasObject.canvasJSON
      };
      return data;
    }

    function copyProduct(id, index) {
      var deferred = $q.defer();
      restFactory.products.copyProduct(id, index).then(function(resp){
        if(resp.success){
          deferred.resolve(resp);
        }
        else{
          deferred.reject(resp);
        }
      });
      return deferred.promise;
    }
  }

}());
