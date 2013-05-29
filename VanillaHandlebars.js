// Name: VanillaHandlerbars.js
// Description: Repsonsible for Adding and Rendering Views, a View Manager for Handlebars templates
// Author: Keith Rosenberg (netpoetica)
// URL: https://github.com/netpoetica/vanilla-handlebars
var VanillaHandlebars = function(/*Import Handlebars */Handlebars, /* Templates Path - String */templatePath){

  // View Manager.
  var views = {};

  return {
    register: function(name, renderFn){
      if(typeof name === 'string' && typeof renderFn == 'function'){
        var _this = this;
        views[name] = {};

        console.log("-> Adding " + name +" view...");
        views[name].render = renderFn;

        $.when($.ajax({
          url: templatePath + name+'.html'
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