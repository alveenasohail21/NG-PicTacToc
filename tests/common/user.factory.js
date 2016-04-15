(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: user', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var user;

    beforeEach(inject(function($injector){

      user = $injector.get('user');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
