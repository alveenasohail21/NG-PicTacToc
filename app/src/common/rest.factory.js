/**
 * @ngdoc service
 * @name app.common.rest
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.common')
    .factory('restFactory', restFactory);

  /* @ngInject */
  function restFactory(Restangular, $localStorage){

    /* Rest Objects */
    var Users = Restangular.all('users');
    var Auth = Restangular.all('auth');
    var Photos = Restangular.all('photos');
    var Media = Restangular.all('media');
    var Products = Restangular.all('products');
      var Projects = Restangular.all('projects');

    /* Return Functions */
    return {
      auth: {
        login: login,
        signup: signup,
        getAuthenticatedUser: getAuthenticatedUser,
        forgotEmailSend: forgotEmailSend,
        socialDisconnect: socialDisconnect,
          getUserDetails: getUserDetails
      },
      users: {
        create: createUser,
        read: readUser,
        update: updateUser,
        remove: removeUser,
        activeSocialProfiles: activeSocialProfiles,
        socialDetails: socialDetails,
          verifySku: verifySku
      },
        projects: {
          getSpecificProject: getSpecificProject,
            deleteProjectPhotoOrProduct: deleteProjectPhotoOrProduct,
            getProjectSelectedPhotoOrProduct: getProjectSelectedPhotoOrProduct,
            savePhotoOrProduct: savePhotoOrProduct
        },
      photos: {
        getPhotos: getPhotos,
        getSocialPhotos: getSocialPhotos,
        deletePhoto: deletePhoto,
        getSelectedPhoto: getSelectedPhoto,
        sendEditedImage: sendEditedImage,
        copyPhoto: copyPhoto
      },

      media: {
        get: getMedia
      },
      products : {
        addInProgressProducts : addInProgressProducts,
        copyProduct: copyProduct,
        deleteProduct : deleteProduct
      },
      oneUrl: oneUrl
    };

    /* Define Fuctions */

    function oneUrl(url){
      return Restangular.oneUrl('dummy', url).get({}, {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
    }

    function login() {
      //
    }

    function signup() {
      //
    }

    function getAuthenticatedUser(){
      return Auth.one('user').get({token: $localStorage.token});
    }

    function forgotEmailSend(email){
      return Auth.one('password').one('forget').post(null, {email: email});
    }

      function getUserDetails(){
          return Auth.one('me').get();
      }

    function createUser(){
      //
    }

    function readUser(){
      //
    }

    function updateUser(){
      //
    }

    function removeUser(){
      //
    }

    function getPhotos(data){
      return Restangular.one('photos').get(data);
    }

    function getSocialPhotos(data){
      //return Photos.one('getSocialPhotos').post(null, {provider: 'facebook'}, {}, {token: $localStorage.token})
    }

    function activeSocialProfiles(){
      return Users.one('social').one('active').get();
    }

    function socialDetails(data){
      return Users.one('social').one('details').get(data);
    }

      function verifySku(sku){
          return Users.one('verifySku').post(null, {sku: sku});
      }

    function deletePhoto(id){ //delete selected photo in step 1
      return Restangular.one('photos', id).remove();
    }

    function getSelectedPhoto(id){ //get a photo selected by user in original size
      return Restangular.one('photos').one(id).get();
    }

    function socialDisconnect(platform){
      return Auth.one('social').one('disconnect').post(null, {platform: platform});
    }

    function sendEditedImage(id, configs){
      return Photos.one('edit').one(id).post(null, configs);
    }

    function copyPhoto(id, index){
      return Photos.one('copy').post(null, {id: id});
    }

    function getMedia(queryParams){
      return Media.one('get').get(queryParams);
    }
    function addInProgressProducts(data){
      return Products.one('inprogress').post(null,data);
    }
    function copyProduct(id, index){
      return Products.one('copy').post(null, {id: id});
    }
    function deleteProduct(id){
      return Restangular.one('products', id).remove();
    }

      function getSpecificProject(id, queryParams){
          return Projects.one(id).get(queryParams);
      }

      function deleteProjectPhotoOrProduct(projectId, photoId){
          return Projects.one(projectId).one('photo').one(photoId).remove();
      }

      function getProjectSelectedPhotoOrProduct(projectId, photoId, queryParams){
          return Projects.one(projectId).one('photo').one(photoId).get((queryParams)?queryParams:{});
      }

      function savePhotoOrProduct(projectId, photoId, data){
          return Projects.one(projectId).one('photo').one(photoId).customPUT(data);
      }
  }
}());
