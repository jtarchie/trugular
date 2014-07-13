var root;

beforeEach(function() {
  root = document.getElementById('jasmine_content');
  spyOn(window.history, "pushState");
  spyOn(window.history, "replaceState");
});
