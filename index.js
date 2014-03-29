"use strict";

var stream = require('stream');
var util = require('util');

function FutureDuplex(opts) {
  stream.Duplex.call(this, opts);

  this._read_wait = -1;
  this._readable  = null;

  this._writable  = null;
  this._writable_chunk = null;
  this._writable_encoding = null;
  this._writable_callback = null;

  // end was called before a writable was set
  this._witable_end = false;
}
util.inherits(FutureDuplex, stream.Duplex);

function pushIfData(into, from, size) {
  var blob = from.read(size);

  // Filter null blobs, because pushing a null blob means
  // that the stream is done. This is a weird behavior, but
  // I imagine there is a rationale behind it.
  if (blob === null) {
    from.on('readable', onReadable);
  } else {
    into.push(blob);
  }

  function onReadable() {
    pushIfData(into, from, size);
  }
}

FutureDuplex.prototype.end = function (chunk, encoding, callback) {
  stream.Duplex.prototype.end.call(this, chunk, encoding, callback);

  var writable = this._writable;

  if (writable) writable.end(chunk, encoding, callback);
  else          this._writable_end = arguments;

  return this;
};

FutureDuplex.prototype.setWritable = function setWritable(writable) {
  this._writable = writable;

  if (this._writable_chunk) {
    writable.write(this._writable_chunk,
                   this._writable_encoding,
                   this._writable_callback);
  }

  if (this._writable_end) {
    writable.end.apply(writable, this._writable_end);
  }
};

FutureDuplex.prototype._write = function _write(chunk, encoding, callback) {
  if (this._writable) {
    this._writable.write(chunk, encoding, callback);
  } else {
    this._writable_chunk = chunk;
    this._writable_encoding = encoding;
    this._writable_callback = callback;
  }
};

FutureDuplex.prototype.setReadable = function (readable) {
  var self = this;
  var size = this._read_wait;

  // propertly end the connection
  readable.on('end', function () {
    self.push(null);
  });

  // if .read was called before a readable was set,
  // we need to immediately push some data
  if (size > -1)
    pushIfData(this, readable);

  this._readable = readable;
};

FutureDuplex.prototype._read = function (size) {
  if (!this._readable) {
    this._read_wait = size;
  } else {
    pushIfData(this, this._readable);
  }
};

module.exports = function (opts) {
  return new FutureDuplex(opts);
};
module.exports.FutureDuplex = FutureDuplex;
