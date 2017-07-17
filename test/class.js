var test = require('tape');
var detect = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/class.js');

test('class', function (t) {
    t.plan(3);

    var scope = detect(src);
    t.same(scope.globals.implicit, []);
    t.same(scope.globals.exported, []);
    t.same(scope.locals, {
        '': [ 'Foo' ],
        'body.0.body.body.0': [ 'a' ],
        'body.0.body.body.1': [ 'b', 'fn' ],
        'body.0.body.body.1.body.body.1': [ 'c' ]
    });
});
