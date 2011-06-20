if(require) {
  var assert = require('assert');
}
var Test = function() {

  var log = function() { }
  //  var log = console.log.bind(console);

  var asyncMap = function(list, fn, cb) {
    var i = 0;
    var doit = function(el, out) {
      if(!el) return cb(null, out);
      fn(el, function(err, res) {
        if(err) {
          return cb(err);
        }
        out.push(res);
        doit(list[i++], out);
      })
    }
    doit(list[i++], [])
  }

  var Context = function(name) {
    this.name = name || "global";
    this.actions = [];
    this.runningAction = null;
  }

  Context.prototype.enqueue = function(action) {
    var self = this;
    if(!action) { //called without action means current action done, try executing next action
      this.runningAction = null;
      action = this.actions.shift();
      if(!action) return; //no more actions to execute
    } if(this.runningAction) {
      this.actions.push(action);
      return action;
    } else {
      this.runningAction = action;
      log('context "%s" executing test "%s"', this.name, action.name)
      return action.exec();
    }
  }

  var globalContext = new Context();

  var Test = function(name, config) {
    if(!(this instanceof Test)) {
      return new Test(name, config).run(Test.onTestEnd)
    }
    var c = config;
    if(typeof config == 'function') {
      c = { fn: config };
    }
    this.fn = c.fn;
    this.name = name;
    this.context = c.context || globalContext; //global if null
    this.assertions = 0;
    this.failures = [];
    this.wrapAssertions();
    this._children = [];
    this._childContext = new Context(this.name);
  }

  Test.onTestEnd = function(err, test) {
    Test.report(err, test);
  }

  Test.prototype.run = function(cb) {
    this.cb = cb;
    return this.context.enqueue(this);
  }

  Test.prototype.exec = function() {
    this.start = new Date();
    this.timeout(1000);
    this.fn(this);
    return this;
  }

  //sets a timeout for this test
  Test.prototype.timeout = function(duration) {
    if(this.timeoutId) {
      log('"%s" clearing timeout and setting it to %d', this.name, duration);
      clearTimeout(this.timeoutId);
    }
    var self = this;
    this.timeoutId = setTimeout(function() {
      log('test %s timed out', test.name)
      self.done(self.name + " did not call 'done' within " + duration + " ms");
    }, duration);
  }

  Test.prototype.test = function(name, config) {
    var c = config;
    //function, config
    if(typeof config == 'function') {
      c = { };
      c.fn = config;
    }
    c.context = this._childContext;
    return this._children.push(new Test(name, c));
  }

  Test.prototype.wrapAssertions = function() {
    var self = this;
    var wrap = function(name, fn) {
      self[name] = function() {
        self.assertions++;
        try {
          fn.apply(assert, arguments)
        } catch(e) {
          self._status = 'fail';
          self.failures.push(e);
        }
      }
    }
    for(var key in assert) {
      var val = assert[key];
      wrap(key, val);
    }
  }

  Test.prototype.getChildren = function() {
    return this._children;
  }

  Test.prototype.getStatus = function() {
    for(var i = 0, len = this._children.length; i < len; i++) {
      var child = this._children[i];
      if(child.getStatus() !== 'pass') {
        log("child %s of %s has status %s", this.name, child.name, child.getStatus())
        return child.getStatus();
      }
    }
    return this._status || 'pass';
  }

  Test.prototype.done = function(err) {
    var self = this;
    this.time = (new Date()) - this.start;
    if(this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    //don't run children if error in parent
    if(err) {
      self._status = 'error';
      log('test %s failing with error status: %s', this.name)
      self.cb(err, self);
      return self.context.enqueue();
    }
    asyncMap(self._children||[], function (child, cb) {
      child.run(cb)
    }, function(err, result) {
      self._status = self._status || 'pass';
      self.cb(err, self);
      self.context.enqueue();
    })
  }
  Test.assert = assert;
  Test.Context = Context;
  return Test;
}();

if(module && module.exports) {
  module.exports = Test;
  Test.report = require(__dirname + '/consoleReporter').report
}


