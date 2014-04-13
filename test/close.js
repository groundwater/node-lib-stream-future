var test = require('tap').test;
var util = require('util');
var stream = require('stream');

var future = require('../index.js');

var liquify = require('lib-stream-liquify');
var solidify = require('lib-stream-solidify');

test("proxy close event", function (t) {
  var pt = new stream.PassThrough();
  var fu = future()

  fu.on('close', function () {
    t.end();
  });

  fu.setReadable(pt);

  pt.emit('close')
});
