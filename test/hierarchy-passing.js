var helper = require(__dirname);

test('hierarchy status - child passes', function(t) {
  var fake = new test.Unit('fake test', {
    fn: function(t) {
      setTimeout(function() {
        t.test('child 1', function(t) {
          t.ok(true);
          t.done();
        })
        t.test('child 2', function(t) {
          t.ok(true);
          t.done();
        })
        t.done();
      }, 10)
    },
    context: helper.context
  });

  fake.run(function(err) {
    setTimeout(function() {
      t.done();
    },10)
  })

  t.test('has passing status', function(t) {
    t.equal(fake.getStatus(), 'pass');
    t.equal(fake.getChildren()[0].getStatus(), 'pass')
    t.equal(fake.getChildren()[1].getStatus(), 'pass')
    t.done();
  })
  t.test('has no assertions of its own', function(t) {
    t.equal(fake.assertions, 0);
    t.done();
  })
  t.test('children have assertions', function(t) {
    t.equal(fake.getChildren()[0].assertions, 1);
    t.equal(fake.getChildren()[1].assertions, 1);
    t.done();
  })
})
