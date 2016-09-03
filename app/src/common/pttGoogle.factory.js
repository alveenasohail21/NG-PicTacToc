/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('pttGoogleFactory', pttGoogleFactory);

  function pttGoogleFactory($q, restFactory, $rootScope, photosFactory, $http){

    var platform = 'google';
    var authResponse = null;
    var requestTimeInSecond;
    var googleAlbumUrl = "https://picasaweb.google.com/data/feed/api/user/default";
    var googlePhotoUrl = "https://picasaweb.google.com/data/feed/api/user/default/albumid/";
    var albums = {
      data: [],
      pagination: {
        from: 0,
        limit: 25,
        next: null,
        previous: null,
        end: false
      }
    };

    /* Return Functions */
    return {
      isAuthenticated: isAuthenticated,
      login: login,
      getAlbums: getAlbums,
      getAlbumPhotos: getAlbumPhotos,
      saveAuth: saveAuth,
      disconnect: disconnect,
      clearInternalData: clearInternalData
    };


    /* Define Fuctions */

    function saveAuth(data){
      authResponse = data;
    }

    function disconnect(){
      authResponse = null;
      albums = {
        data: [],
        pagination: {
          from: 0,
          limit: 25,
          next: null,
          previous: null,
          end: false
        }
      }
    }

    function clearInternalData(){
      albums = {
        data: [],
        pagination: {
          from: 0,
          limit: 25,
          next: null,
          previous: null,
          end: false
        }
      }
    }

    function isAuthenticated(){
      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        // console.log("not authenticated");
        return false;
      }
      else if(isTokenExpire()){
        // console.log("token is expired");
        return false;
      }
      else{
        return true;
      }
    }

    function isTokenExpire(){
      var diff = ((requestTimeInSecond+authResponse.expiresIn) - requestTimeInSecond);
      // console.log("Diff>exp: ", diff>authResponse.expiresIn);
      return (diff>authResponse.expiresIn);
    }

    function login(){
      var deffered = $q.defer();
      requestTimeInSecond = (new Date()).getSeconds();
      // console.log(requestTimeInSecond);
      FB.login(function(response) {
        // console.log("Login Resposne: ",response);
        if (response.status === 'connected') {
          // console.log("connected");
          // Logged into your app and Facebook.
          authResponse = response.authResponse;
          deffered.resolve(response);
        } else if (response.status === 'not_authorized') {
          // console.log("not_authorized");
          // The person is logged into Facebook, but not your app.
          deffered.reject('Something is wrong');
        } else {
          // console.log("not logged in");
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          deffered.reject('Something is wrong');
        }
      }, {
        scope: 'email,user_photos,public_profile'
      });
      return deffered.promise;
    }

    function getAlbums(cursor,login){
      var deffered = $q.defer();

      if(login){
        authResponse = null;
      }
      // if not authenticated, authenticate first and get access_token
      if(authResponse == null){
        restFactory.users.socialDetails({platform: platform})
          .then(function(resp){
            if(resp.success){
              $rootScope.user.socialName = resp.data.social_name;
              saveAuth(resp.data);
            }
            if(albums.data.length>0 && !cursor){
               console.log("pttGoogleFactory: albums already present");
              deffered.resolve(albums.data);
            }
            else{
              _getAlbums();
            }
          })
      }
      // if authenticated and token is not expired, get albums
      else{
        // console.log("Setting Facebook details on rootscope");
        $rootScope.user.socialName = authResponse.social_name;
        $rootScope.user.socialPicture = authResponse.picture;

        if(albums.data.length>0 && !cursor){
           console.log("pttGoogleFactory: albums already present");
          deffered.resolve(albums.data);
        }
        else{
          // check if all albums are downloaded
          if(albums.pagination.end){
             console.log("pttGoogleFactory: no more album");
            deffered.resolve([]);
          }
          else{
            _getAlbums();
          }
        }
      }

      function _getAlbums(){
        var url;
        switch(cursor){
          case 'next':
            url = albums.pagination.next;
            break;
          case 'previous':
            url = albums.pagination.previous;
            break;
          default:
            url = googleAlbumUrl;
            break;
        }
        var data = {
          'access_token' : authResponse.access_token,
          'alt' : 'json',
          'kind' : 'album',
          'access': 'all'
        };

        $http({
          method : 'GET',
          url : url,
          params    : data,
          headers : {'Content-Type': 'application/json'}
        })
          .then(function(resp){
            authResponse.picture = resp.data.feed.gphoto$thumbnail.$t;
            $rootScope.user.socialPicture = authResponse.picture;
            deffered.resolve(resp.data);
          },function (err) {
            deffered.reject('Something is wrong');
          });
      }

      return deffered.promise;

    }

    function getAlbumPhotos(albumId, index, pagingCursor){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!isAuthenticated()){
        login().then(function(resp){
          _getAlbumPhotos();
        })
      }
      // if authenticated and token is not expired, get albums
      else{
        _getAlbumPhotos();
      }

      function _getAlbumPhotos(){
        // if authenticated, get album cover
        var url= googlePhotoUrl + albumId;
        var defaultGooglePhotoStreamSize = 6;
        var data = {
          'start-index' : 1,
          'access_token' :   authResponse.access_token,
          'alt' : 'json',
          'access': 'all',
          'max-results' : defaultGooglePhotoStreamSize
        };
        // if pagingCursor is present
        if(pagingCursor != null){
          url = pagingCursor;
          data = {};
          data.access_token =   authResponse.access_token;
        }
        // console.log(url);
        $http({
          method : 'GET',
          url : url,
          params    : data,
          headers : {'Content-Type': 'application/json'}
        }).then(function (response) {
            // console.log("Album Photos Response: ", response);
            if (response && !response.error) {
              // resolve
              response.photos = [];
              response.data.feed.entry.forEach(function(elem, index){
                response.photos[index] = photosFactory.mapSocialPhotos(elem, platform);
              });
              deffered.resolve(response);
            }
            else{
              deffered.reject('Something is wrong');
            }
          },function (err) {
          deffered.reject('Something is wrong');
        });
      }

      return deffered.promise;
    }

  }

}());
