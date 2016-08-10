(function () {

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration($authProvider, API_URL) {


    $authProvider.httpInterceptor = false;
    $authProvider.withCredentials = false;
    $authProvider.tokenPrefix = 'ptt';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';

    $authProvider.loginUrl = API_URL + '/auth/login';
    $authProvider.signupUrl = API_URL + '/auth/signup';

    $authProvider.facebook({
      url: API_URL + '/auth/facebook',
      clientId: '1226159537401789',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email','user_photos'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: {width: 580, height: 400}
    });

    $authProvider.google({
      url: API_URL + '/auth/google',
      clientId: '251468221872-1i73ucukf8975jo58rp3fo5m2kqa77f7.apps.googleusercontent.com',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      type: '2.0',
      popupOptions: {width: 452, height: 633}
    });

    // Instagram
    $authProvider.instagram({
      name: 'instagram',
      url: API_URL + '/auth/instagram',
      clientId: '3a4fa0286c9549a58a4bf3c415799d6f',
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['scope'],
      scope: ['basic','public_content'],
      scopeDelimiter: '+',
      type: '2.0'
    });

  }

}());
