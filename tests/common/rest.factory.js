(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: rest', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var rest;

    beforeEach(inject(function($injector){

      rest = $injector.get('rest');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
