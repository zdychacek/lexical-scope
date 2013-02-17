var falafel = require('falafel');

module.exports = function (src) {
    var locals = {};
    var globals = {};
    
    falafel(String(src), function (node) {
        if (node.type === 'VariableDeclaration') {
            // take off the leading `var `
            var id = getScope(node);
            node.declarations.forEach(function (d) {
                locals[id][d.id.name] = d;
            });
        }
        else if (node.type === 'FunctionDeclaration') {
            var id = getScope(node.parent);
            locals[id][node.id.name] = node;
        }
    });
    
    return { locals: locals, globals: globals };
    
    function lookup (node) {
        for (var p = node; p; p = p.parent) {
            if (isFunction(p) || p.type === 'Program') {
                var id = getScope(p);
                if (locals[id][node.name]) {
                    return id;
                }
            }
        }
        return undefined;
    }
    
    function getScope (node) {
        for (
            var p = node;
            !isFunction(p) && p.type !== 'Program';
            p = p.parent
        );
        var id = idOf(node);
        if (node.type === 'VariableDeclaration') {
            // the var gets stripped off so the id needs updated
            id = id.replace(/\.init$/, '.right');
        }
        if (!locals[id]) locals[id] = {};
        return id;
    }
    
};

function isFunction (x) {
    return x.type === 'FunctionDeclaration'
        || x.type === 'FunctionExpression'
    ;
}

function idOf (node) {
    var id = [];
    for (var n = node; n.type !== 'Program'; n = n.parent) {
        if (!isFunction(n)) continue;
        var key = keyOf(n).join('.');
        id.unshift(key);
    }
    return id.join('.');
}

function keyOf (node) {
    var p = node.parent;
    var kv = Object.keys(p)
        .reduce(function (acc, key) {
            acc.keys.push(key);
            acc.values.push(p[key]);
            acc.top.push(undefined);
            
            if (Array.isArray(p[key])) {
                var keys = Object.keys(p[key]);
                acc.keys.push.apply(acc.keys, keys);
                acc.values.push.apply(acc.values, p[key]);
                acc.top.push.apply(
                    acc.top,
                    keys.map(function () { return key })
                );
            }
            
            return acc;
        }, { keys : [], values : [], top : [] })
    ;
    var ix = kv.values.indexOf(node);
    var res = [ kv.top[ix], kv.keys[ix] ].filter(Boolean);
    if (node.parent.type === 'CallExpression') {
        res.unshift.apply(res, keyOf(node.parent.parent));
    }
    return res;
}
