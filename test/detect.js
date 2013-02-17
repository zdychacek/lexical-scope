var test = require('tape');
var detect = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/sources/detect.js');

test('check locals and globals', function (t) {
    t.plan(3);
    
    var scope = detect(src);
    t.same(scope.globals.implicit, [
        'w', 'foo', 'process', 'console', 'xyz'
    ]);
    t.same(scope.globals.exported, [
        'w', 'RAWR', 'BLARG', 'ZZZ'
    ]);
    t.same(scope.locals[''], [ 'x', 'y', 'z', 'beep' ]);
});
