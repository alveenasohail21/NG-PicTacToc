(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: products', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var products;

    beforeEach(inject(function($injector){

      products = $injector.get('products');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
