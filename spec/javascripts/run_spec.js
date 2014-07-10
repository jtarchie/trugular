describe('Running an applicaiton', function() {
  'use strict';

  var app;

  beforeEach(function() {
    app = new $trugular();
    spyOn(app, '$go');
  });

  it('replaces to the current request path', function() {
    app.$run();
    expect(app.$go).toHaveBeenCalledWith(location.pathname, true);
  });
});
