var test = require('tap').test;
var util = require('util');
var stream = require('stream');
var future = require('../index.js');
var liquify = require('lib-stream-liquify');
var solidify = require('lib-stream-solidify');

function noop(){}

test("proxy end when called after setWritable", function (t) {
  t.plan(1);

  var mock = {
    end: function() {
      t.ok(true);
    },
    on: noop,
    once: noop,
    emit: noop,
  };

  var f = future();

  f.setWritable(mock);
  f.end();
});

test("proxy end when called before setWritable", function (t) {
  t.plan(1);

  var mock = {
    end: function() {
      t.ok(true);
    },
    on: noop,
    once: noop,
    emit: noop,
  };

  var f = future();

  f.end();
  f.setWritable(mock);
});
