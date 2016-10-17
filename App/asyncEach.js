// async-each MIT license (by Paul Miller from http://paulmillr.com).
// modified for iterable and limit
/*  "gitHead": "f2342d85633d0dc1034a49387ca01c08c1189823",
  "homepage": "https://github.com/paulmillr/async-each/", */
(function(globals) {
  'use strict';
  var each = function(items, limit, next, callback) {
    if (!items || typeof items[Symbol.iterator]!="function") 
		throw new TypeError('each() expects iterable as first argument');
	if (typeof limit != 'number' || limit<=0)limit=Number.MAX_SAFE_INTEGER;
    if (typeof next !== 'function') throw new TypeError('each() expects function as second argument');
    if (typeof callback !== 'function') callback = Function.prototype; // no-op

    var transformed = new Array();
    var returned = false;
	var count=0, max=0;

	//items.forEach(function(item, index) {
	var method = (index)=>{
	  nx=it.next();//console.warn(index)
	  return function(error, transformedItem) {
        if (returned) return;
        if (error) {
          returned = true;
          return callback(error);
        }count++;
        transformed[index] = transformedItem;
        if(!nx.done)
			next(nx.value, method(max++));
		else if (count == max) 
			return callback(undefined, transformed);
      };
	}
	const it=items[Symbol.iterator]();
	var nx=it.next();
	if(nx.done)callback(undefined, transformed);
    for(;limit>0&&!nx.done&&!returned;limit--)
		next(nx.value, method(max++));
  };

  if (typeof define !== 'undefined' && define.amd) {
    define([], function() {
      return each;
    }); // RequireJS
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = each; // CommonJS
  } else {
    globals.asyncEach = each; // <script>
  }
})(this);
