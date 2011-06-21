var helper = require(__dirname);

test('a passing test', function(t) {
  //run test
  var passingtest = new test('passing test', {
    fn: function(t) {
      t.ok(true);
      t.equal(1, 1);
      t.strictEqual(1, 1);
      t.done();
    },
    context: helper.context
  })

  passingtest.run(function() {
    t.done();
  });

  t.test('has "pass" status', function(t) {
    t.equal(passingtest.getStatus(), "pass");
    t.done();
  })

  t.test('has 3 assertions', function(t) {
    t.equal(passingtest.assertions, 3);
    t.done();
  })

  t.test('has 0 failures', function(t) {
    t.equal(passingtest.failures.length, 0);
    t.done();
  })
})
