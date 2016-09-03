(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: alerts', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var alerts;

    beforeEach(inject(function($injector){

      alerts = $injector.get('alerts');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
