fui.define('core/util',function( module ){
	
	"use strict";
	
	var util = function(context) {
		return new util.fn.init(context);
	};
	
	util.fn = util.prototype = {
		
		constructor: util,
		
		init:function(context) {
			this.context = context;
			this.error = null;
			return this;
		},

		// each封装
		each:function(callback){
			
			var context = this.context, name, i = 0;
			
			if(this.is('string')){
				context = context.split('');
			};
			var length = context.length;
			if (length == undefined) {
				for (name in context) {
					if (callback.call(context[name], name, context[name]) === false) break;
				}
			} else {
				for (var value = context[0]; i < length && callback.call(value, i, value) !== false; value = context[++i]) {}
			}
			return context;
		},
		length: function(){
			var context = this.context;
			if(this.is('plainObject')){
				var length = 0;
				for(var i in context) length ++;
				return length
			}
			return context.length;
		},
		
		// 类型判断
		is:function(type){
			var context = this.context;
			
			
			/* var class2type = {},
			toString = class2type.toString;
			
			this.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			  class2type["[object " + name + "]"] = name.toLowerCase();
			})
			 */
			// 获取数据类型
			var is = function(obj) {
				return null == obj ? obj + '' : Array == obj.constructor ? 'array' : typeof obj;
				//return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
			};

			
			if(!type) return is(context);
			
			switch(type){
				// 验证不存在的对象
				case 'null': 
					return null === context;

				// 验证空值
				case 'empty':
					return (context=='' || context && context.length == 0) ? true : false;
				
				// 验证简单对象 {a:b}
				case 'plainObject': 
					return 'object'==is(context) && 'isPrototypeOf' in context;
				
				// 验证空对象 {}
				case 'emptyObject':
					if(!this.is('object')){
						return false
					}else{
						var hasKey = (function(){for (var i in context) return true})();
						if(hasKey) return false;
						return true
					}
				
				// 验证网址(xx://)
				case 'url':
					return /^((.*\:)?\/\/)/.test(context);
		
				// 验证电子邮件
				case 'email':
					return /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/.test(context);

				// 验证手机
				case 'phone':
					return /^1[3458]\d{9}$/.test(context);
				
				// 验证身份证
				case 'id':
					return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(context);
				
				// 验证IP地址
				case 'ip':
					return /^((([1-9]\d?)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(([1-9]\d?)|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/.test(context);
				
				// 验证汉字
				case 'zh':
					return /^[\u4e00-\u9fa5]+$/.test(context);
				
				// 验证英文
				case 'en':
					return /^[A-Za-z]+$/.test(context);
			}
			return type === is(context);
		},
		// 去除空格
		trim:function(type){
			var context = this.context;
			if(!this.is('string')) return context;
			switch(type){
				
				// 首空格
				case 'left': 
					return context.replace(/(^\s*)/g, ''); 
				
				// 尾空格
				case 'right':
					return context.replace(/(\s*$)/g, '');
				
				// 全部空格
				case 'all': 
					return context.replace(/\s/g, '');
				
				// 首尾空格
				default: 
					return context.replace(/^\s*|\s*$/g, '');
			}
		},
		to:function(type,params){
			var context = this.context;
			switch(type){
				
				// 转换大写
				case 'upper':
					return context.toUpperCase();
				
				// 转换小写
				case 'lower': 
					return context.toLowerCase();
				
				// 转换数字
				case 'int': 
					return parseInt(context);
				
				// 转换字符串
				case 'string': 
					return String(context);
				
				// 转换数组
				case 'array': 
					if(this.is('array')){
						return context;
					}else if(this.is('string')){
						return params||params==''?context.split(params):[context];
					}else if(this.is('plainObject')){
						var ret=[];
						this.each(function(i, ele) {
							var obj = ele;
							if(params){
								obj = {};
								obj[i] = ele;
							}
							ret.push(obj);
						});
						return ret;
					}else{
						return [context];
					}
					
				// 转换对象
				case 'object': 
					if(this.is('array')){
						var context = {};
						this.each(function(i,ele){
							context[i] = ele;
						})
					}
					return context;
			}	
		},
		
		// 排序
		sort:function(order){
			var context = this.context;
			var type = this.is();
			
			switch(type){		
				// 字符串排序
				case 'string': 
					context = this.to('array','');
					context = context.sort();
					if(order=='desc') context = context.reverse(); 
					return context.join('')
				
				// 数组排序
				case 'array':
					context = context.sort();
					if(order=='desc') context = context.reverse(); 
					return context
				
				// 对象排序
				case 'object': 
					var array = this.to('array',true);
					var ret = {};
					context = array.sort();
					if(order=='desc') context = context.reverse(); 

					util(context).each(function(i,ele){
						pxui.extend(ret,ele)
					})
					return ret;
			};
			
		},
		remove:function (val){
			var context = this.context;
			
			var type = this.is();
			
			switch(type){		
			
				// 删除指定字符串
				case 'string': 
					return context.replace(val,'');
				
				// 删除数组指定元素
				case 'array':
					var i = context.indexOf(val);
					if(i>-1) context.splice(i, 1);
					return context;
				
				// 删除对象指定属性
				case 'object': 
					this.each(function(i,ele){
						if(util(val).is('plainObject')){
							if((i in val) && val[i] == ele) delete context[i];
						}else{
							if(val == ele) delete context[i];
						}
					})
					return context;
			};
			
		},
		merge:function(val){
			var context = this.context;
			
			var type = this.is();
			
			switch(type){		
				// 合并字符串
				case 'string': 
					return context + val;
				
				// 合并数组
				case 'array':
					util(val).is('array') || (val = [val]);
					return context.concat(val);
				
				// 合并对象
				case 'object': 
					pxui.extend(context,val);
					return context;
			};
		}
	};
	util.fn.init.prototype = util.fn;
	
	var userAgent = navigator.userAgent.toLowerCase();
	util.browser={
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
		safari: /webkit/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	}
	return util;
});


fui.extend({'util':fui.require('core/util')});