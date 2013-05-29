// Name: VanillaHandlerbars.js
// Description: Repsonsible for Adding and Rendering Views, a View Manager for Handlebars templates
// Author: Keith Rosenberg (netpoetica)
// URL: https://github.com/netpoetica/vanilla-handlebars
var VanillaHandlebars = function(/*Import Handlebars */Handlebars, /* Templates Path - String */templatePath, /* Async Config - Boolean */bAsync){

  // View Manager.
  var views = {};

  // Using async false in case you need to render a view right away.
  // If you have a routing mechanism in place, you can probably set this to true or remove the line.
  // You will get an error like 'template' is not a function if you are having synchronization problems
  if(typeof bAsync !== 'boolean'){
    bAsync = false;
  }

  return {
    register: function(name, renderFn){
      if(typeof name === 'string' && typeof renderFn == 'function'){
        var _this = this;
        views[name] = {};

        console.log("-> Adding " + templatePath + name +'.html view..');
        views[name].render = renderFn;

        $.when($.ajax({
          async: bAsync,
          url: templatePath + name +'.html'
        })).then(function(data){
           views[name].template = Handlebars.compile(data);
        });

      }
    },
    render: function(name, context){
      var view = views[name];
      if(typeof view.render == 'function'){
        console.log("-> Rendering "+name+" view...");
        view.render(view.template(context));
      }
    }

  }

};