var helper = require(__dirname)

test({
  'adding multiple tests': function(t) {
    var subject = new test.Unit('test with children', {
      fn: function(t) {
        t.test({
          'child 1': function(t) {
            t.done();
          },
          'child 2': function(t) {
            t.done();
          }
        })
        t.done();
      },
      context: helper.context
    })

    subject.run(function() {
      t.equal(subject.getChildren().length, 2, "Should have two children");
      t.equal(subject.getStatus(), 'pass')
      t.done();
    })
  },
  'adding more tests': function(t) {
    t.done();
  }
})
