var vh = new VanillaHandlebars(Handlebars, "./partials");

describe('Instance', function(){
  it('should report "[object VanillaHandlebars]" from toString()', function(){
    expect(vh.toString()).to.equal("[object VanillaHandlebars]");
  });
});

describe('The public API', function(){
  it('should contain a register function', function(){
    expect(typeof vh.register).to.equal("function");
  });
  it('should contain a render function', function(){
    expect(typeof vh.render).to.equal("function");
  })
});

describe('Partials', function(){
  var bDidRender = false;

  beforeEach(function(done){

    vh.register('markup', function(data){
      bDidRender = true;

      // complete the async beforeEach
      done();
    });

    // Render actually calls the done function.
    vh.render('markup');

  });

  it('should render after async load', function(){
    expect(bDidRender).to.equal(true);
  });
});