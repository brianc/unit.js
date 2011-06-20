var helper = require(__dirname);

test('a timing out test', function(t) {
  //set longer timeout than the timing out test
  t.timeout(3000);

  var timeoutTest = new test('timeout test', {
    fn: function(t) {
      t.timeout(10);
      t.childRan = false;
      t.test('child timeout', function() {
        t.childRan = true;
      })
    },
    context: helper.context
  })

  var timeoutTestError = null;
  timeoutTest.run(function(err, tt) {
    timeoutTestError = err;
    t.done();
  });

  t.test('has "error" status', function(t) {
    t.equal(timeoutTest.getStatus(), "error");
    t.done();
  })

  t.test('child tests never run', function(t) {
    t.strictEqual(timeoutTest.childRan, false);
    t.done();
  })

  t.test('passes error to callback', function(t) {
    t.equal(typeof timeoutTestError, 'string')
    t.done();
  })

})
