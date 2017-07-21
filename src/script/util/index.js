!function(){
	"use strict";
	var util = fui.util;
	var userAgent = navigator.userAgent.toLowerCase();
	fui.extend(util,{
		userAgent: userAgent,
		browser:{
			version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
			safari: /webkit/.test( userAgent ),
			opera: /opera/.test( userAgent ),
			msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
			mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
		}
	});
	fui.extend(util.fn,{
		each : function(callback){
			var selector = this.selector, name, i = 0;
			if(this.isString){
				selector = selector.split('');
			};
			var length = selector.length;
			if (length == undefined) {
				for (name in selector) {
					if (callback.call(selector[name], name, selector[name]) === false) break;
				}
			} else {
				for (var value = selector[0]; i < length && callback.call(value, i, value) !== false; value = selector[++i]) {}
			}
			return selector;
		},
		is : function(type){
			var selector = this.selector;
			if(!type){
				return this.type;
			}
			switch(type){

			// 验证空值
			case 'empty':
				return (selector=='' || selector && selector.length == 0) ? true : false;
			
			// 验证简单对象 {a:b}
			case 'plainObject': 
				return this.isObject && 'isPrototypeOf' in selector;
			
			// 验证空对象 {}
			case 'emptyObject':
				var selector = this.selector;
				if(!this.isObject){
					return false
				}
				var hasKey = (function(){for (var i in selector) return true})();
				if(hasKey){
					return false;
				}
				return true;
			
			// 验证网址(xx://)
			case 'url':
				return /^((.*\:)?\/\/)/.test(this.selector);

			// 验证电子邮件
			case 'email':
				return /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/.test(this.selector);

			// 验证手机
			case 'phone':
				return /^1[3458]\d{9}$/.test(this.selector);
			
			// 验证身份证
			case 'id':
				return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.selector);
			
			// 验证IP地址
			case 'ip':
				return /^((([1-9]\d?)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}(([1-9]\d?)|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/.test(this.selector);
			
			// 验证汉字
			case 'zh':
				return /^[\u4e00-\u9fa5]+$/.test(this.selector);
			
			// 验证英文
			case 'en':
				return /^[A-Za-z]+$/.test(this.selector);
			default:
				return type === this.type;
			}
		},
		// 去除空格
		trim:function(type){
			var selector = this.selector;
			if(!this.isString){
				return selector;
			}
			switch(type){
				
				// 首空格
				case 'left': 
					return selector.trimLeft(); 
				
				// 尾空格
				case 'right':
					return selector.trimRight(); 
				
				// 全部空格
				case 'all': 
					return selector.trimAll(); 
				
				// 首尾空格
				default: 
					return selector.trim(); 
			}
		},
		to:function(type,params){
			var selector = this.selector;
			switch(type){
				
				// 转换大写
				case 'upper':
					return selector.toUpperCase();
				
				// 转换小写
				case 'lower': 
					return selector.toLowerCase();
				
				// 转换数字
				case 'int': 
					return parseInt(selector);
				
				// 转换字符串
				case 'string': 
					return String(selector);
				
				// 转换数组
				case 'array': 
					if(this.is('array')){
						return selector;
					}else if(this.is('string')){
						return params||params==''?selector.split(params):[selector];
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
						return [selector];
					}
					
				// 转换对象
				case 'object': 
					if(this.is('array')){
						var ret = {};
						this.each(function(i,ele){
							ret[i] = ele;
						})
					}
					return ret;
			}	
		},
		// 排序
		sort:function(order){
			var selector = this.selector;
			var type = this.is();
			
			switch(type){		
				// 字符串排序
				case 'string': 
					selector = this.to('array','');
					selector = selector.sort();
					if(order=='desc') selector = selector.reverse(); 
					return selector.join('')
				
				// 数组排序
				case 'array':
					selector = selector.sort();
					if(order=='desc') selector = selector.reverse(); 
					return selector
				
				// 对象排序
				case 'object': 
					var array = this.to('array',true);
					var ret = {};
					selector = array.sort();
					if(order=='desc') selector = selector.reverse(); 

					util(selector).each(function(i,ele){
						pxui.extend(ret,ele)
					})
					return ret;
			};
			
		},
		remove:function (val){
			var selector = this.selector;
			
			var type = this.is();
			
			switch(type){		
			
				// 删除指定字符串
				case 'string': 
					return selector.replace(val,'');
				
				// 删除数组指定元素
				case 'array':
					var i = selector.indexOf(val);
					if(i>-1) selector.splice(i, 1);
					return selector;
				
				// 删除对象指定属性
				case 'object': 
					this.each(function(i,ele){
						if(util(val).is('plainObject')){
							if((i in val) && val[i] == ele) delete selector[i];
						}else{
							if(val == ele) delete selector[i];
						}
					})
					return selector;
			};
			
		},
		merge:function(val){
			var selector = this.selector;
			
			var type = this.is();
			
			switch(type){		
				// 合并字符串
				case 'string': 
					return selector + val;
				
				// 合并数组
				case 'array':
					util(val).is('array') || (val = [val]);
					return selector.concat(val);
				
				// 合并对象
				case 'object': 
					pxui.extend(selector,val);
					return selector;
			};
		}
	});
	
}();