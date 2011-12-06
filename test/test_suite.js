var TestSuite;
TestSuite = (function() {
  function TestSuite(name, test_cases) {
    if ( 'undefined' === typeof arguments.callee.test_suites ) { arguments.callee.test_suites = []; }

    this.name = name;
    this.test_cases = [];
    for ( var key in test_cases ) {
      if ( 'function' === typeof test_cases[key] ) {
        var test_case = new TestCase(key, test_cases[key]);
        this.test_cases.push(test_case);
      }
    }

    arguments.callee.test_suites.push(this);
  }

  TestSuite.prototype.run = function() {
    for ( var i = 0; i < this.test_cases.length; i += 1 ) {
      var test_case = this.test_cases[i];
      test_case.run();
    }
  }

  return TestSuite;
}());