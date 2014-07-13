describe('Binding values to a template from the scope', function() {
  'use strict';

  var app;

  beforeEach(function() {
    app = new $trugular({rootElement: root});
  });

  describe('when a template reference a scope value', function() {
    beforeEach(function() {
      app.$route({
        url: '/',
        template: 'My age is <span tg-bind="age"></span>',
        controller: function($scope) { $scope.age = 31; }
      });
      app.$go();
    });

    it('should should evaluate in to the DOM', function() {
      expect(root.textContent).toEqual('My age is 31');
    });
  });
});
