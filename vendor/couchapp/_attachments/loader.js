var base;

function couchapp_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
	  var script = scripts[i];
	  if (script.charAt(0) == '/' && base) {
		  script = base + script;
	  }
    document.write('<script src="'+script+'"><\/script>')
  };
};

couchapp_load([
  "/_utils/script/sha1.js",
  "/_utils/script/json2.js",
  //"/_utils/script/jquery.js",
  "jquery-1.6.2.min.js",
  "jquery-ui-1.8.16.custom.min.js",
  "/_utils/script/jquery.couch.js",
  "vendor/couchapp/jquery.couch.app.js",
  "vendor/couchapp/jquery.couch.app.util.js",
  "vendor/couchapp/jquery.mustache.js",
  "vendor/couchapp/jquery.evently.js",
  "vendor/couchapp/jquery.pathbinder.js",
  "vendor/couchapp/jquery.jqote2.js"
]);
