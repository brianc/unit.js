var helper = require(__dirname);

test('calling done multiple times', function(t) {
  var multiDone = new test('multidone',{
    fn: function(t) {
      t.done();
    },
    context: helper.context
  })

  var runs = 0;
  multiDone.run(function() {
    runs++;
    t.done();
  })

  t.test('second done throws', function(t) {
    t.equal(runs, 1);
    t.equal(multiDone.getStatus(), 'pass');
    t.done();
  })
})
