# lib-stream-future

## install

```bash
npm install --save lib-stream-future
```

## usage

### delayed readable stream

```javascript
var future = require('lib-stream-future');

var f = future();

f.pipe(process.stdout);

setTimeout(function () {
  someStream.pipe(f);
}, 1000);
```

### delayed writable stream

```javascript
var future = require('lib-stream-future');

var f = future();

process.stdin.pipe(f);

setTimeout(function () {
  f.pipe(someSink);
}, 1000);
```

### fake a duplex stream

```javascript
function holla(opts) {
  var f = future();
  var req = http.request(opts, function (res) {
    f.setReadable(res);
  });
  f.setWritable(req);
  return f;
}

A.pipe(holla('http://example.com/my/API')).pipe(B);
```
