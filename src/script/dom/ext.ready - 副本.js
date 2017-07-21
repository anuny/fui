!function(fui,util,$){
	var doc = document;
	var domready = function (ready) {
		var fns = [], fn, f = false,This = this,
		testEl = doc.documentElement,
		hack = testEl.doScroll,
		domContentLoaded = 'DOMContentLoaded',
		addEventListener = 'addEventListener',
		onreadystatechange = 'onreadystatechange',
		readyState = 'readyState',
		loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/,
		loaded = loadedRgx.test(doc[readyState]);

		function flush(f) {
			loaded = 1;
			while (f = fns.shift()){
				util(f).isFunction && f.call(This);
			}
		}

		doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
			doc.removeEventListener(domContentLoaded, fn, f)
			flush()
		}, f)


		hack && doc.attachEvent(onreadystatechange, fn = function () {
			if (/^c/.test(doc[readyState])) {
				doc.detachEvent(onreadystatechange, fn);
				flush();
			}
		});

		if(ready = hack){
			return function (fn) {
				if(self != top){
					if(loaded){
						fn.call(This)
					}else{
						fns.push(fn)
					}
				}else{
					try {
						testEl.doScroll('left')
					} catch (e) {
						return setTimeout(function() { ready(fn) }, 50)
					}
					fn.call(This)
				}
			}
		}else{
			return function (fn) {
				if(loaded){
					fn.call(This)
				}else{
					fns.push(fn);
				}
			}
		}
	};
	$.extend({
		isReady:false,
		ready:function(callback){
			$doc = $(doc);
			if(this.isReady){
				callback.call(doc);
			}else{
				domready.call(doc)(callback);
				this.isReady = true;
			}
			return $doc;
		}
	});
}(fui,fui.util,fui.dom);