(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: auth', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.auth'));

    var auth;

    beforeEach(inject(function($injector){

      auth = $injector.get('auth');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
