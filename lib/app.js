(function(window, document, undefined) {
  'use strict';

  function $events() {
    var events = {};

    this.$on = function(names, func) {
      names.split(' ').forEach(function(name) {
        events[name] = events[name] || [];
        events[name].push(func);
      });
      return this;
    };

    this.$broadcast = function(name) {
      var args = arguments;
      if(name in events) {
        events[name].forEach(function(func) {
          func.apply(func, Array.prototype.slice.call(args, 1));
        });
      }
      return this;
    };

    this.$tracked = function() {
      return Object.keys(events);
    };
  };

  function $route(options) {
    var template = options.template;
    if(template === undefined) {
      var el = document.getElementById(options.url);
      if(el) { template = el.innerHTML; }
    }
    this.template = template;

    var compiledUrl = options.url;
    if(compiledUrl.slice(-1) !== '/') { compiledUrl += '\/?'; }
    this.compiledUrl = new RegExp("^" + compiledUrl + "$");
    this.controller = options.controller;

    this.matches = function(path) {
      var matches = this.compiledUrl.exec(path);
      return matches && matches.length > 0;
    };
  }

  var $trugular = window.$trugular;

  if(!$trugular) {
    $trugular = function(options) {
      options = options || {};
      var rootElement = options.rootElement || document.body,
          routes = [], app = this, events = new $events(),
          directives = {}, listeners = new $events();

      /* Private functions */
      function currentPath() {
        app.$go(window.location.pathname, true);
      }

      function clickHandler(event) {
        if(event.target.tagName === 'A') {
          event.preventDefault();
          app.$go(event.target.pathname);
        }
      }

      /* Application DSL */
      app.$route = function(options) {
        var route = new $route(options);
        routes.push(route);
        return this;
      };

      app.$run = function() {
        window.addEventListener('popstate', currentPath);
        rootElement.addEventListener('click', clickHandler);
        currentPath();
        return this;
      };

      app.$destroy = function() {
        window.removeEventListener('popstate', currentPath);
        rootElement.removeEventListener('click', clickHandler);
      };

      app.$go = function(path, replace) {
        path = path || '/';

        var foundRoute;
        routes.forEach(function(route) {
          if(route.matches(path)) {
            foundRoute = route;
          }
        });

        if(!foundRoute) { throw('Could not find route ' + path); }
        if(replace) {
          window.history.replaceState({}, "", path);
        } else{
          window.history.pushState({}, "", path);
        }
        events.$broadcast('route:change', Object.create(foundRoute));
        return this;
      };

      app.$directive = function(name, func) {
        directives[name] = func;
      };

      app.$apply = function(func) {
        if(func) { func(); }
        this.$digest();
      };

      app.$digest = function(previous) {
        var self = this;
        var watching = listeners.$tracked();
        self.$$previous = self.$$previous || {};
        watching.forEach(function(name) {
          if(self.$$previous[name] !== self[name]) {
            self.$$previous[name] = self[name];
            listeners.$broadcast(name);
          }
        });
      };

      app.$compile = function(element, scope) {
        var selector = Object.keys(directives).map(function(name) {
          return '[tg-' + name + ']';
        }).join(',');

        var elements = element.querySelectorAll(selector);
        Array.prototype.forEach.call(elements, function(element) {
          for(var name in directives) {
            var attributeName = 'tg-' + name;
            if(element.hasAttribute(attributeName)) {
              directives[name](Object.create(scope), element, element.getAttribute(attributeName));
            }
          }
        });
      };

      app.$watch = listeners.$on;

      /* Event handling */
      events.$on('route:change', function(route) {
        route.scope = Object.create(app);
        route.scope.$apply(function() {
          if(route.controller) {
            route.controller(route.scope);
          }
          if(route.template) {
            rootElement.innerHTML = route.template;
            var element = route.scope.$compile(rootElement, route.scope);
          }
        });
      });

      /* Custom directives */
      app.$directive('bind', function(scope, element, value) {
        function binder() {
          element.innerHTML = scope[value];
        }
        scope.$watch(value, binder);
        binder();
      });

    };
  }

  window.$trugular = $trugular;

})(window, document);
