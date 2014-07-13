describe('Routing', function() {
  'use strict';

  var app;

  beforeEach(function() {
    app = new $trugular({rootElement: root});
    app.$route({
      url: '/world',
      template: 'Hello World'
    }).$route({
      url: '/',
      template: 'Root URL'
    });
  });

  afterEach(function() { app.$destroy(); });

  describe('When calling a specific URL', function() {
    it('push the request URL', function() {
      app.$go('/world');
      expect(window.history.pushState).toHaveBeenCalledWith({  }, '', '/world');
    });

    it('ignored the trailing slash', function() {
      app.$go('/world/');
      expect(window.history.pushState).toHaveBeenCalledWith({  }, '', '/world/');
    });
  });

  describe('When calling no URL', function() {
    beforeEach(function() {
      app.$go();
    });

    it('push the default root request URL', function() {
      expect(window.history.pushState).toHaveBeenCalledWith({  }, '', '/');
    });
  });

  describe('When calling a missing route', function() {
    it('throws a nice error message', function() {
      expect(function() {
        app.$go('/dontcare');
      }).toThrow('Could not find route /dontcare');;
    });

    it('does not push the request URL', function() {
      try{ app.$go('/dontcar'); }
      catch(err) {expect(window.history.pushState).not.toHaveBeenCalled();}
    });
  });

  describe('When calling a route that replace set to true', function() {
    it('sets the replaces the curreny history element', function() {
      app.$go(null, true);
      expect(window.history.replaceState).toHaveBeenCalledWith({  }, '', '/');
    });

    it('does not call #pushState', function() {
      app.$go(null, true);
      expect(window.history.pushState).not.toHaveBeenCalled();
    });
  });
})

