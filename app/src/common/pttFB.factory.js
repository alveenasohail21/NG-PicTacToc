/**
 * @ngdoc service
 * @name app.common.user
 * @description < description placeholder >
 */

(function(){
  'use strict';
  angular
    .module('app.common')
    .factory('pttFBFactory', pttFBFactory);

  function pttFBFactory($q, restFactory){

    var authResponse = null;
    var requestTimeInSecond;
    var graphAPIversion = "v2.6";
    var albums = {
      data: [],
      pagination: {
        from: 0,
        limit: 9,
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
      getAlbumCover: getAlbumCover,
      getAlbumPhotos: getAlbumPhotos,
      saveAuth: saveAuth
    };


    /* Define Fuctions */

    function saveAuth(data){
      authResponse = data;
    }

    function isAuthenticated(){
      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        console.log("not authenticated");
        return false;
      }
      else if(isTokenExpire()){
        console.log("token is expired");
        return false;
      }
      else{
        return true;
      }
    }

    function isTokenExpire(){
      var diff = ((requestTimeInSecond+authResponse.expiresIn) - requestTimeInSecond);
      console.log("Diff>exp: ", diff>authResponse.expiresIn);
      return (diff>authResponse.expiresIn);
    }

    function login(){
      var deffered = $q.defer();
      requestTimeInSecond = (new Date()).getSeconds();
      console.log(requestTimeInSecond);
      FB.login(function(response) {
        console.log("Login Resposne: ",response);
        if (response.status === 'connected') {
          console.log("connected");
          // Logged into your app and Facebook.
          authResponse = response.authResponse;
          deffered.resolve(response);
        } else if (response.status === 'not_authorized') {
          console.log("not_authorized");
          // The person is logged into Facebook, but not your app.
          deffered.reject('Something is wrong');
        } else {
          console.log("not logged in");
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          deffered.reject('Something is wrong');
        }
      }, {
        scope: 'email,user_photos,public_profile'
      });
      return deffered.promise;
    }

    function getAlbums(cursor){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!authResponse){
        restFactory.users.socialDetails({platform: 'facebook'})
          .then(function(resp){
            console.log(resp);
            if(resp.success){
              authResponse = resp.data;
            }
            if(albums.data.length>0 && !cursor){
              console.log("albums present");
              deffered.resolve(albums.data);
            }
            else{
              _getAlbums();
            }
          })
      }
      // if authenticated and token is not expired, get albums
      else{
        if(albums.data.length>0 && !cursor){
          console.log("albums present");
          deffered.resolve(albums.data);
        }
        else{
          _getAlbums();
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
            url = graphAPIversion + '/'+ authResponse.social_id+ "/albums";
            break;
        }
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.access_token,
            limit: albums.pagination.limit,
            fields: 'name,source,picture,count'
          },
          function (response) {
            console.log("Albums Response: ", response);
            if (response && !response.error) {
              // save paging
              if(response.paging.next){
                albums.pagination.next = response.paging.next;
              }
              if(response.paging.previous){
                albums.pagination.previous = response.paging.previous;
              }
              // add received album length in from
              albums.pagination.from += response.data.length;
              // see if no albums remaining
              if(response.data.length < albums.pagination.limit){
                albums.pagination.end = true;
              }
              deffered.resolve(response.data);
              // get the album covers of each album
              //response.data.forEach(function(elem, index, array){
              //  getAlbumCover(elem.id)
              //    .then(function(resp){
              //      // add the image to elem
              //      elem.cover_photo.url = resp.url;
              //      // push elem to album
              //      albums.data.push(elem);
              //      // resolve on the last album
              //      if(index == response.data.length-1){
              //        // album with cover
              //      }
              //    });
              //});
            }
            else{
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;

    }

    /* Unused */
    function getAlbumCover(albumId){
      var deffered = $q.defer();

      // if not authenticated, authenticate first and get access_token
      if(!isAuthenticated()){
        login().then(function(resp){
          _getAlbumCover();
        })
      }
      // if authenticated and token is not expired, get albums
      else{
        _getAlbumCover();
      }

      function _getAlbumCover(){
        // if authenticated, get album cover
        var url= graphAPIversion + '/'+ albumId + "/picture";
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.access_token
          },
          function (response) {
            console.log("Album Cover Response: ", response);
            if (response && !response.error) {
              // resolve
              deffered.resolve(response.data);
            }
            else{
              deffered.reject('Something is wrong');
            }
          }
        );
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
        var url= graphAPIversion + '/'+ albumId + "/photos";
        // if pagingCursor is present
        if(pagingCursor != null){
          url = pagingCursor;
        }
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.access_token,
            fields: 'images,link,name,from,picture,height,width,source'
          },
          function (response) {
            console.log("Album Photos Response: ", response);
            if (response && !response.error) {
              // resolve
              deffered.resolve(response);
            }
            else{
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;
    }

    function getPhotoById(photoId){
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
        var url= graphAPIversion + '/'+ photoId;
        console.log(url);
        FB.api(url, 'GET',
          {
            access_token: authResponse.accessToken,
            fields: 'picture'
          },
          function (response) {
            console.log("Single Photo Response: ", response);
            if (response && !response.error) {
              // resolve
              deffered.resolve(response.data);
            }
            else{
              deffered.reject('Something is wrong');
            }
          }
        );
      }

      return deffered.promise;
    }

  }

}());