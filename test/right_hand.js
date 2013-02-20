var test = require('tape');
var detect = require('../');
var src = require('./sources/right_hand.js');

test('globals on the right-hand of assignment', function (t) {
    t.plan(3);
    
    var scope = detect(src);
    t.same(scope.globals.implicit, [
        'exports', '__dirname', '__filename'
    ]);
    t.same(scope.globals.exported, []);
    t.same(scope.locals, { '': [] });
});
