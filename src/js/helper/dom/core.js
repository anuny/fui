fui.define('dom',function( module ){
	
	"use strict";
	
	var 

	// 匹配简单选择器
	regSimple = /^[\w\-_#]+$/,
		
	// 匹配类选择器 .demo
	regClass = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
	
	// 匹配ID选择器 #demo
	regId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
	
	// 匹配标签选择器 div
	regTag = /^([\w\*\-_]+)/,
	
	// 匹配html选择器 <div>test<div>
	regHtml = /<[^>]+>/g,
	
	util = fui.util,
	
	win = fui.window,
	
	doc = fui.document,
	
	// 获取选择器
	getName = function(selector,regular){
		return (selector.match(regular) || [ null, null ])[1];
	},
	
	// 判断元素类名
	hasClass = function (className, node) {
		return new RegExp('(\\s|^)' + className + '(\\s|$)').test(node.className);
	},

	// getByClassName 兼容封装
	getByClassName = function (className, context) {
		var ele = [];
		// 原生支持
		if (context.getElementsByClassName){
			return context.getElementsByClassName(className);
		};
			
		
		// 兼容处理
		var nodes = context.getElementsByTagName("*");
		util(nodes).each(function(){
			var hasclass = hasClass(className, this);
			if (hasclass){
				ele.push(this);
			}
		});
		return ele;
	},
	
	// 获取 dom
	getElement = function (selector, context) {
		
		if(!context.nodeType){
			return false;	
		}
		
		// body对象
		if (selector === "body"){
			return doc.body;
		}
		
		// 获取选择器名
		var IdName    = getName(selector,regId),
			TagName   = getName(selector,regTag),
			ClassName = getName(selector,regClass);
		
		// ID 对象 #test
		if (IdName){
			return doc.getElementById(IdName);
		} 

		var nodes = getByClassName(ClassName, context);
	
		// Tag和ClassName 对象 div.test
		if (ClassName && TagName) {
			var ele = [];
			util(nodes).each(function(){
				if (this.tagName.toLowerCase() == TagName){
					ele.push(this);
				}
			});
			return ele
		}
		
		// ClassName 对象 .test
		if (ClassName) {
			return nodes;
		}
		
		// Tag 对象 div
		if (TagName) {
			var node = context.getElementsByTagName(TagName);
			if(node.length){
				return node
			}
			 
		}

		// 文本对象
		return [(context||doc).createTextNode(selector)];
	},
	
	// 转换为真数组
	makeArray = function (array) {
		var ret = [];
		if (array != null) {
			var len = array.length;
			if (len == null || array.split || array.setInterval || array.call) {
				ret[0] = array;
			} else {
				util(array).each(function(i) {
					ret[i] = this;
				});
			}
		}
		
		return ret;
	},
	
	// 把html转换为dom对象
	parseHTML = function (html) {	
		var div = doc.createElement("div");
		div.innerHTML = html;
		var ele = div.childNodes;
		div = null;
		return ele;
	},

	
	fliter = function (selector, context) {
		
		selector = util(selector).trim();
		
		// 判断html
		var isHtml = regHtml.test(selector);
		if (isHtml){
			return parseHTML(selector);
		}
		
		// 判断简单选择器 #demo .test div 
		var simple = regSimple.test(selector);
		if (simple){
			return getElement(selector, context);
		}

		// 原生方法
		/* if (context.querySelectorAll){
			return context.querySelectorAll(selector);
		} */

		// 兼容方法
		return dom.find(selector, context);	
	},
	
	query = function(selector, context){
		
		"use strict";
		// 选择器
		var selector = selector || doc;
		
		//  DOM 节点上下文
		var context  = context  || doc; 
		
		// 如果选择器是 window或document
		if(selector === win || selector === doc){
			context = selector
		}

		var _selector= util(selector);
		
		if(_selector.is('number')){
			selector = _selector.to('string');
		};
		
		var elements = selector
		
		if(_selector.is('string')){
			elements = fliter(selector, context)
		};
		
		if(selector.nodeType){
			elements = [elements]
		}
		elements = makeArray(elements);
		return {elements:elements, selector:selector, context:context};
	},
	dom = function(selector, context) {
		return new dom.fn.fuiDom(selector, context)
	};
	dom.fn = dom.prototype = {
		constructor: dom,
		fuiDom: function(selector, context) {
			var result = query(selector, context);
			this.length = 0;
			this.selector = result.selector;
			this.context  = result.context;
			[].push.apply(this, result.elements);
			return this;
		}
	}
	dom.fn.fuiDom.prototype = dom.fn;
	module.exports = dom;
});
fui.extend({dom:fui.require('dom/core')});