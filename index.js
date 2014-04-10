#!/usr/bin/env node
"use strict";

var stream = require('stream');
var util = require('util');

util.inherits(FutureDuplex, stream.Duplex);
function FutureDuplex () {
  stream.Duplex.call(this);

  this.readable = new stream.PassThrough();
  this.writable = new stream.PassThrough();

  var self = this;
  this.readable.on('readable', function () {
    var chunk;
    while (null !==(chunk = self.readable.read())) {
      if (!self.push(chunk)) break;
    }
  });

  this.readable.on('end', function () {
    self.push(null);
  });
}

FutureDuplex.prototype._write = function (chunk, encoding, done) {
  this.writable.write(chunk, encoding, done);
};

FutureDuplex.prototype._read = function (size) {

};

FutureDuplex.prototype.end = function(chunk, encoding, done) {
  this.writable.end(chunk, encoding, done);

  return this;
};

FutureDuplex.prototype.setWritable = function(writable) {
  this.writable.pipe(writable);
};

FutureDuplex.prototype.setReadable = function(readable) {
  readable.pipe(this.readable);
};

module.exports = function(){
  return new FutureDuplex();
};

// http://codewinds.com/blog/2013-08-31-nodejs-duplex-streams.html#!
