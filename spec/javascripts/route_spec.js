describe('Routing', function() {
  'use strict';

  var app, body;

  beforeEach(function() {
    body = document.getElementById('jasmine_content');
    app = new $trugular({rootElement: body});
    app.$route({
      url: '/world',
      template: 'Hello World'
    }).$route({
      url: '/',
      template: 'Root URL'
    });

    spyOn(window.history, "pushState");
    spyOn(window.history, "replaceState");
  });

  describe('When calling a specific URL', function() {
    beforeEach(function() {
      app.$go('/world');
    });

    it('renders the template', function() {
      expect(body.textContent).toEqual('Hello World');
    });

    it('push the request URL', function() {
      expect(window.history.pushState).toHaveBeenCalledWith({  }, '', '/world');
    });
  });

  describe('When calling no URL', function() {
    beforeEach(function() {
      app.$go();
    });

    it('defaults to root /', function() {
      expect(body.textContent).toEqual('Root URL');
    });

    it('push the request URL', function() {
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

