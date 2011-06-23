var helper = require(__dirname);

test('an error test', function(t) {
  var childRan = false;
  var errTest = new test.Unit('error test', {
    fn: function(t) {
      t.test('some child', function(t) {
        childRan = true;
      })
      try {
        t.ok(true);
        t.ok(false);
        alsdkfj
        t.ok(true);
        t.ok(false);
      } catch(e) {
        t.done(e)
      }
    },
    context: helper.context
  })
  var testErr = null;
  errTest.run(function(err) {
    testErr = err;
    setTimeout(function() {
      t.done();
    }, 10)
  })

  t.test('should pass the error to the callback', function(t) {
    t.ok(testErr);
    t.done();
  })
  t.test('has error status', function(t) {
    t.equal(errTest.getStatus(), 'error');
    t.done();
  })
  t.test('has right number of assertions', function(t) {
    t.equal(errTest.assertions, 2);
    t.done();
  })
  t.test('has right number of failures', function(t) {
    t.equal(errTest.failures.length, 1);
    t.done();
  })
  t.test('child never ran', function(t) {
    t.strictEqual(childRan, false);
    t.done();
  })
})
