var test = require('tap').test;
var util = require('util');
var stream = require('stream');
var future = require('../index.js');
var liquify = require('lib-stream-liquify');
var solidify = require('lib-stream-solidify');

test("bugfix-1 against double end write", function (t) {
  t.plan(1);

  var f = future();
  var s = solidify()

  s.text(function (e, text) {
    console.log('done')
    t.equal(text, 'hello')
  });

  f.end('hello');
  f.setWritable(s)
});

test("bugfix-1 against double end write reverse order", function (t) {
  t.plan(1);

  var f = future();
  var s = solidify()

  s.text(function (e, text) {
    console.log('done')
    t.equal(text, 'hello')
  });

  f.setWritable(s)
  f.end('hello');
});
