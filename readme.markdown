# lexical-scope

*This is a fork of [`lexical-scope`](https://www.npmjs.com/package/insert-module-globals) which uses [Babylon](https://github.com/babel/babylon) parser instead of [`acorn`](https://www.npmjs.com/package/acorn).*

Detects global and local lexical identifiers from javascript source code.

# example

``` js
var detect = require('@zdychacek/lexical-scope');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/src.js');

var scope = detect(src);
console.log(JSON.stringify(scope,null,2));
```

input:

```
var x = 5;
var y = 3, z = 2;

w.foo();
w = 2;

RAWR=444;
RAWR.foo();

BLARG=3;

foo(function () {
    var BAR = 3;
    process.nextTick(function (ZZZZZZZZZZZZ) {
        console.log('beep boop');
        var xyz = 4;
        x += 10;
        x.zzzzzz;
        ZZZ=6;
    });
    function doom () {
    }
    ZZZ.foo();

});

console.log(xyz);
```

output:

```
$ node example/detect.js
{
  "locals": {
    "": [
      "x",
      "y",
      "z"
    ],
    "body.7.expression.body.7.arguments.0": [
      "BAR",
      "doom"
    ],
    "body.7.expression.body.7.arguments.0.body.body.1.expression.body.1.arguments.0": [
      "xyz",
      "ZZZZZZZZZZZZ"
    ],
    "body.7.expression.body.7.arguments.0.body.body.2": []
  },
  "globals": {
    "implicit": [
      "w",
      "foo",
      "process",
      "console",
      "xyz"
    ],
    "implicitProperties": {
      "w": [
        "foo"
      ],
      "foo": [
        "()"
      ],
      "process": [
        "nextTick"
      ],
      "console": [
        "log"
      ],
      "xyz": [
        "*"
      ]
    },
    "exported": [
      "w",
      "RAWR",
      "BLARG",
      "ZZZ"
    ]
  }
}
```

# live demo

If you are using a modern browser, you can go to http://lexical-scope.forbeslindesay.co.uk/ for a live demo.

# methods

``` js
var detect = require('@zdychacek/lexical-scope')
```

## var scope = detect(src, opts)

Return a `scope` structure from a javascript source string `src`.

`scope.locals` maps scope name keys to an array of local variable names declared
with `var`. The key name `''` refers to the top-level scope.

`scope.globals.implicit` contains the global variable names that are expected to
already exist in the environment by the script.

`scope.globals.explicit` contains the global variable names that are exported by
the script.

`scope.globals.implicitProperties` contains the properties of global variable
names that have been used. There are two special implicit property names:

* `"()"` - when an implicit variable has been called
* `"*"` - when an implicit variable has been used in a context that is not a
property and not a call

You cas pass list of plugins for underlying Babylon parser via `opts.parserPlugins` option.

# install

With [npm](https://npmjs.org) do:

```
npm install @zdychacek/lexical-scope
```

# license

MIT
