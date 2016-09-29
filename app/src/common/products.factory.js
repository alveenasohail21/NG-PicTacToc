(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('productsFactory', productsFactory);


  function productsFactory($q, restFactory, alertFactory,photosFactory){
    return {
      addInProgressProducts : addInProgressProducts,
      copyProduct: copyProduct,
      deleteProduct : deleteProduct
    };

    function addInProgressProducts(data) {
      var deffered = $q.defer();
      restFactory.products.addInProgressProducts(data).then(function (resp) {
        alertFactory.success(null, resp.message);
        deffered.resolve(resp.data);
      },function (err) {
        alertFactory.error(null, resp.message);
        deffered.reject(err);
      });
      return deffered.promise;
    }

    function copyProduct(id, index) {
      var deferred = $q.defer();
      restFactory.products.copyProduct(id, index).then(function(resp){
        if(resp.success){
          resp.data.base64 = photosFactory._data.photos[index].base64;
          photosFactory._data.photos.splice(index, 0, angular.copy(resp.data));
          photosFactory._data.totalCount++;
          deferred.resolve(resp);
        }
        else{
          deferred.reject(resp);
        }
      });
      return deferred.promise;
    }
    function deleteProduct(id,index) {
      var deferred = $q.defer();
      restFactory.products.deleteProduct(id).then(function(resp){
        if(resp.success){
          photosFactory._data.photos.splice(index, 1);
          photosFactory._data.totalCount--;
          alertFactory.success(null , resp.message);
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
