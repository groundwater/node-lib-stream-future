var test = require('tap').test;
var util = require('util');
var stream = require('stream');
var future = require('../index.js');
var liquify = require('lib-stream-liquify');
var solidify = require('lib-stream-solidify');

test(function (t) {
  t.plan(2);

  var r = future();
  var a = {
    a: 'A'
  };

  var b = {
    b: 'B'
  }

  r.setReadable(liquify(b));
  r.setWritable(solidify().json(function (err, json){
    t.deepEqual(json, a);
  }));

  liquify(a).pipe(r).pipe(solidify()).json(function (err, json) {
    t.deepEqual(json, b);
  });
});

test(function (t) {
  t.plan(2);

  var r = future();
  var a = {
    a: 'A'
  };

  var b = {
    b: 'B'
  }

  var s = solidify().json(function (err, json){
    t.deepEqual(json, a);
  });

  liquify(a).pipe(r).pipe(solidify()).json(function (err, json) {
    t.deepEqual(json, b);
  });

  r.setReadable(liquify(b));
  r.setWritable(s);
});
