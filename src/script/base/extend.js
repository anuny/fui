fui.define('core/extend',function( module ){

	'use strict';
	
	var reg = function(obj) {
		fui.components.compiled[obj.id] = obj;
		return this;
    },
	unreg = function(obj) {
        delete fui.components.compiled[obj.id];
		delete fui.components.compiled[obj.uid];
		return this;
    },
	_regClass = function(className, fn){
		
		className = className.toLowerCase();
			
		if (!fui.components.classes[className]) {
			fui.components.classes[className] = fn;
			fn.prototype.type = className;
		}
		
		var _className = fn.prototype.className;
		
		if (_className!=null && !fui.components.uiClasses[_className]){
			fui.components.uiClasses[_className] = fn;
			
		};
		return fui;
	},
	_plugin =  function(extend, target, method) {
		
        if (typeof target != "function") {
			return fui;
		}
        var newExt = extend, 
			newExt_proto = newExt.prototype, 
			target_proto = target.prototype;
			
        if (newExt.superclass == target_proto){
			return fui;
		};
		
		
		
        newExt.superclass = target_proto;
        newExt.superclass.constructor = target;
	
	
        for (var i in target_proto) {
			newExt_proto[i] = target_proto[i];
		}
        if (!method){
			return newExt;
		}
		
		for (i in method) {
			newExt_proto[i] = method[i];
		}

        return fui;
    },
	plugin = function(config){

		function createFunc(name){
			var modules;
			var fn = 'fui.'+name+'=function(){var superclass = fui.'+name+'.superclass;superclass.constructor.call(this);this.superclass=superclass};modules=fui.'+name;
			eval(fn);
			return modules;
		};
		
		var module = createFunc(config.module)
		
		
		// 目标插件
		var extendArry = config.extend.split('.');
		var extendType = extendArry[0];
		var extendName = extendArry[1];
		var extend = fui[extendType][extendName];
		
	
	
		var method = config.method;
		
		var regCls = config.regCls;
		
		var attrs = config.attrs;
		
		if(attrs){
			method.attrs = attrs
		}
		
		if(regCls){
			method.className = fui.fix+regCls;
		}
	
		_plugin(module, extend, method);
		
		
		if(regCls){
			_regClass(regCls,module);
		}
	},
	get = function(node) {
		
        if (!node) {
			return null;
		}

        if (typeof node == "string") {
			var compiled = fui.components.compiled[node];
			if(compiled && compiled.url && compiled.load){
				compiled.load();
			}
			return compiled;
		}
		
		var obj;
		
		var id =  node.id;
		
		if(id){
			obj = fui.get(id);
		}
		
		if(obj){
			return obj
		}
	
        return null;
    },
	getClassByUICls = function(className) {
        return this.components.uiClasses[className.toLowerCase()];
    },
	copyTo =  function(target, options) {
        if (!target && !options){
			return {}
		}
		
		if (target && !options){
			return target
		}

		for (var option in options){
			target[option] = options[option];
		}
        return target;
    },
	applyTo = function(node) {
		
		
		if (typeof node == "string") {
			node = $('#'+node);
		}
		
		
		if (!node.length){
			return this;
		};
		
		
		var obj = fui.get(node);
		
		if (obj) {
			throw new Error("not applyTo a fui control");
		}

		var attrs = this.getAttrs(node);
		
		
		var init = this.init(node);
		
		delete attrs._applyTo;
		
		if (attrs.defaultValue == null && attrs.value !==null){
			attrs.defaultValue = attrs.value;
		}
		
		this.el.replaceAll(node);

		this.set(attrs);
		return this;
	};

	module.exports = {
		reg:reg,
		unreg:unreg,
		plugin:plugin,
		getClassByUICls:getClassByUICls,
		applyTo:applyTo,
		copyTo:copyTo,
		get:get
	};	
});
fui.extend(fui.require('core/extend'));




