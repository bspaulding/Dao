load('javascripts/dao.js');

load('test/test_case.js');
load('test/test_suite.js');
load('test/dao_test.js');

var test_cases = TestCase.test_cases;
var failures = [];
for ( var i = 0; i < test_cases.length; i += 1 ) {
  var test_case = test_cases[i];
  test_case.run();
  if ( test_case.status === 'passed' ) {
    print('.');
  } else {
    failures.push(test_case);
    print('F');
  }
}

for ( var i = 0; i < failures.length; i += 1 ) {
  var test_case = failures[i];
  print((i + 1) + ') ' + test_case.name);
}

print('\n' + test_cases.length + ' test cases. ' + failures.length + ' failed.');