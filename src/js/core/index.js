(function(win){
	'use strict';
	
	var doc = win.document,
	
	modules = {},
	
	fui = function(selector,callback) {
		return new fui.fn.init(selector,callback);
	},
	
	require = function(name,callback){
		if('function' == typeof name) return name();
		Array == name.constructor||(name = [name]);
		var exports=[];
		for(var i=0,len=name.length;i<len;i++){
			var exp = getExp(name[i])
			exports.push(exp)
		}
		if('function' == typeof callback){
			callback.apply(null,exports)
		}else{
			return exports[0]
		}
	},
	
	getExp = function (name) {
		var mod = modules[name];
		return mod ? ("function" == typeof mod.factory ? mod.factory(mod) ? mod.factory(mod) :mod.exports :mod.factory):name + ' is not define';
	},
	
	define = function(name,factory){
		if(!name||'string' !== typeof name) return  name + ' is not string';
		modules[name]={
			name:name,
			factory:factory,
			exports:{}
		}
	};
	fui.fn = fui.prototype = {	
		constructor: fui,
		init:function(selector,callback) {
			if(typeof selector == 'function'){
				fui.on('ready',selector);
			}else if(selector.nodeType){
				fui.parse(selector,callback);
			}
		}
	};
	fui.fn.init.prototype = fui.fn;
	fui.extend = fui.fn.extend = function (module) {
		var i = 0, target = this, deep = false, length = arguments.length, obj, empty, items, x;
		"boolean" === typeof arguments[0] ? (deep = true, i = 1, length > 2 ? (i = 2, target = arguments[1]) :void 0) :length > 1 ? (i = 1, target = arguments[0]) :void 0;
		for (x = i; x < length; x++) {
			obj = arguments[x];
			for (items in obj) {
				if (obj[items] === target) continue;
				deep && "object" === typeof obj[items] && obj[items] !== null ? (empty = Array == obj[items].constructor ? [] :{}, 
				target[items] = fui.extend(deep, target[items] || empty, obj[items])) :target[items] = obj[items];
			}
		}
		return target;
	};
	fui.extend({define:define,require:require,window:win,document:doc});
	win.fui = fui;
})(this);