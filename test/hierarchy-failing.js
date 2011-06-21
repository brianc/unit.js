var helper = require(__dirname);

test('hierarchy status - child fails', function(t) {
  var subject = new test('fake', {
    fn: function(scope) {
      setTimeout(function() {
        scope.test('failing child', function(scope) {
          scope.ok(false);
          scope.done();
        })
        scope.done();
      }, 10)
    },
    context: helper.context
  })
  subject.run(function() {
    t.equal(subject.getStatus(), 'fail')
    t.done();
  })
})
