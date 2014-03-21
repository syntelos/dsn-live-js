
 See branch "gh-pages"  http://w.syntelos.net/dsn-live-js/

 Status: non operative

 See also https://github.com/nasa/NASA-APIs/issues/4

 The XMLHttpRequest header 'X-Requested-With' causes the browser
 (chrome) to call the HTTP request method "OPTIONS".

 The "Origin" header value "http://w.syntelos.net" (not
 "http://eyes.nasa.gov") is rejected by the cross site scripting
 access control protocol: the server responds without the
 "Access-Control-Allow-Origin" header.
