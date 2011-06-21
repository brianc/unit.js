var indent = 0;
var totalTime = 0;
var totalAssertions = 0;
var totalTests = 0;

var RED = 31;
var GREEN = 32;

var color = function (color,str) {
  process.stdout.write('\u001B[' + color + 'm')
  process.stdout.write(str);
  process.stdout.write('\u001B[39m')
}

var check = function() {
  color(GREEN, '✔  ');
}

var ex = function() {
  color(RED, '✖  ');
}

var printError = function(spaces, err) {
  e = err.stack || err;
  e = e.split('\n').map(function(er) {
    return spaces + '   ' +er;
  }).join('\n')
  color(RED, e + '\n');
}

process.on('exit', function() {
  console.log();
  console.log('%d tests %d assertions in %d seconds', totalTests, totalAssertions, totalTime/1000);
  console.log();
})


var consoleReporter = {
  report: function(err, test) {
    totalTests++;
    totalAssertions += test.assertions;
    totalTime += test.time;
    switch(test.getStatus()) {
    case 'pass':
      check();
      break;
    case 'fail':
    case 'error':
      ex();
      break;
    case 'ignore':
    default:
      break;
    }

    var space = '  ';
    var spaces = '';
    for(var i = 0; i < indent; i++) {
      spaces += space;
    }
    process.stdout.write(spaces);
    process.stdout.write(test.name + '\n', 'utf8');

    if(test.failures.length) {
      test.failures.forEach(function(fail) {
        printError(spaces, fail)
      })
    }

    if(err) {
      printError(spaces, err)
    } else {
      indent++;
      test.getChildren().forEach(function(child) {
        consoleReporter.report(null, child);
      })
      indent--;
    }
  }
}

module.exports = consoleReporter;
