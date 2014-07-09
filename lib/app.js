(function(window, document) {
  'use strict';

  var $trugular = window.$trugular;

  if(!$trugular) {
    $trugular = function(options) {
      options = options || {};
      var rootElement = options.rootElement || document.body,
          routes = [];

      this.$route = function(options) {
        routes.push(options);
        return this;
      };

      this.$run = function() {
        window.addEventListener('popstate', function(event) {
          debugger;
        });
        this.$go('/', true);
        return this;
      };

      this.$go = function(path, replace) {
        path = path || '/';

        var foundRoute;
        routes.forEach(function(route) {
          if(route.url === path) {
            foundRoute = route;
          }
        });

        if(!foundRoute) { throw('Could not find route ' + path); }
        if(replace) {
          window.history.replaceState({}, "", path);
        } else{
          window.history.pushState({}, "", path);
        }
        rootElement.textContent = foundRoute.template;
        return this;
      };
    };
  }

  window.$trugular = $trugular;

})(window, document);
