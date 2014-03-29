var test = require('tap').test;
var util = require('util');
var stream = require('stream');
var future = require('../index.js');
var liquify = require('lib-stream-liquify');
var solidify = require('lib-stream-solidify');

test(function (t) {
  var r = future();
  var a = {
    a: 'A'
  };

  r.setReadable(liquify(a));
  r.end().pipe(solidify()).json(function (err, json) {
    t.deepEqual(json, a);
    t.end();
  });
});
