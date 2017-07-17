var test = require('tape');
var detect = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/object_spread.js');

test('object spread', function (t) {
    t.plan(3);

    var scope = detect(src, { parserPlugins: [ 'objectRestSpread' ] });
    t.same(scope.globals.implicit, []);
    t.same(scope.globals.exported, []);
    t.same(scope.locals, { '': [ 'a' ] });
});
