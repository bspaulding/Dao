var TestCase;
TestCase = (function() {
  function TestCase(name, fn) {
    if ( 'undefined' === typeof arguments.callee.test_cases ) { arguments.callee.test_cases = []; }

    this.name = name;
    this.fn = fn;
    this.status = 'pending';

    arguments.callee.test_cases.push(this);
  }

  TestCase.prototype.run = function() {
    if ( this.fn() ) {
      this.status = 'passed';
    } else {
      this.status = 'failed';
    }
  }

  return TestCase;
}());