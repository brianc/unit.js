var helper = require(__dirname);

test('a failing test', function(t) {
  var failingTest = new test('failing test', {
    fn: function(t) {
      t.equal(1, 2);
      t.strictEqual(true, 1);
      t.strictEqual(false, 0);
      t.ok(false);
      t.fail("omfg");
      t.done();
    },
    context: helper.context
  })
  t.test('should have status of "fail"', function(t) {
    t.equal(failingTest.getStatus(), 'fail');
    t.done();
  })

  t.test('should have right number of assertions', function(t) {
    t.equal(failingTest.assertions, 5);
    t.done();
  });

  t.test('should have right number of failures', function(t) {
    t.equal(failingTest.failures.length, 5);
    t.done();
  })

  failingTest.run(function() {
    t.done();
  })



})
