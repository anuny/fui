fui.define('template',function( module ){
	var artTemplate = (function(){
		/**
		 * 模板引擎
		 * @name    template
		 * @param   {String}            模板名
		 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
		 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
		 */
		var template = function (filename, content) {
			return typeof content === 'string'
			?   compile(content, {
					filename: filename
				})
			:   renderFile(filename, content);
		};


		/**
		 * 设置全局配置
		 * @name    template.config
		 * @param   {String}    名称
		 * @param   {Any}       值
		 */
		template.config = function (name, value) {
			defaults[name] = value;
		};



		var defaults = template.defaults = {
			openTag: '<%',    // 逻辑语法开始标签
			closeTag: '%>',   // 逻辑语法结束标签
			escape: true,     // 是否编码输出变量的 HTML 字符
			cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
			compress: false,  // 是否压缩输出
			parser: null      // 自定义语法格式器 @see: template-syntax.js
		};


		var cacheStore = template.cache = {};


		/**
		 * 渲染模板
		 * @name    template.render
		 * @param   {String}    模板
		 * @param   {Object}    数据
		 * @return  {String}    渲染好的字符串
		 */
		template.render = function (source, options) {
			return compile(source, options);
		};


		/**
		 * 渲染模板(根据模板名)
		 * @name    template.render
		 * @param   {String}    模板名
		 * @param   {Object}    数据
		 * @return  {String}    渲染好的字符串
		 */
		var renderFile = template.renderFile = function (filename, data) {
			var fn = template.get(filename) || showDebugInfo({
				filename: filename,
				name: 'Render Error',
				message: 'Template not found'
			});
			return data ? fn(data) : fn;
		};


		/**
		 * 获取编译缓存（可由外部重写此方法）
		 * @param   {String}    模板名
		 * @param   {Function}  编译好的函数
		 */
		template.get = function (filename) {

			var cache;
			
			if (cacheStore[filename]) {
				// 使用内存缓存
				cache = cacheStore[filename];
			} else if (typeof document === 'object') {
				// 加载模板并编译
				var elem = document.getElementById(filename);
				
				if (elem) {
					var source = (elem.value || elem.innerHTML)
					.replace(/^\s*|\s*$/g, '');
					cache = compile(source, {
						filename: filename
					});
				}
			}

			return cache;
		};


		var toString = function (value, type) {

			if (typeof value !== 'string') {

				type = typeof value;
				if (type === 'number') {
					value += '';
				} else if (type === 'function') {
					value = toString(value.call(value));
				} else {
					value = '';
				}
			}

			return value;

		};


		var escapeMap = {
			"<": "&#60;",
			">": "&#62;",
			'"': "&#34;",
			"'": "&#39;",
			"&": "&#38;"
		};


		var escapeFn = function (s) {
			return escapeMap[s];
		};

		var escapeHTML = function (content) {
			return toString(content)
			.replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
		};


		var isArray = Array.isArray || function (obj) {
			return ({}).toString.call(obj) === '[object Array]';
		};


		var each = function (data, callback) {
			var i, len;        
			if (isArray(data)) {
				for (i = 0, len = data.length; i < len; i++) {
					callback.call(data, data[i], i, data);
				}
			} else {
				for (i in data) {
					callback.call(data, data[i], i);
				}
			}
		};


		var utils = template.utils = {

			$helpers: {},

			$include: renderFile,

			$string: toString,

			$escape: escapeHTML,

			$each: each
			
		};/**
		 * 添加模板辅助方法
		 * @name    template.helper
		 * @param   {String}    名称
		 * @param   {Function}  方法
		 */
		template.helper = function (name, helper) {
			helpers[name] = helper;
		};

		var helpers = template.helpers = utils.$helpers;




		/**
		 * 模板错误事件（可由外部重写此方法）
		 * @name    template.onerror
		 * @event
		 */
		template.onerror = function (e) {
			var message = 'Template Error\n\n';
			for (var name in e) {
				message += '<' + name + '>\n' + e[name] + '\n\n';
			}
			
			if (typeof console === 'object') {
				console.error(message);
			}
		};


		// 模板调试器
		var showDebugInfo = function (e) {

			template.onerror(e);
			
			return function () {
				return '{Template Error}';
			};
		};


		/**
		 * 编译模板
		 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
		 * @name    template.compile
		 * @param   {String}    模板字符串
		 * @param   {Object}    编译选项
		 *
		 *      - openTag       {String}
		 *      - closeTag      {String}
		 *      - filename      {String}
		 *      - escape        {Boolean}
		 *      - compress      {Boolean}
		 *      - debug         {Boolean}
		 *      - cache         {Boolean}
		 *      - parser        {Function}
		 *
		 * @return  {Function}  渲染方法
		 */
		var compile = template.compile = function (source, options) {
			
			// 合并默认配置
			options = options || {};
			for (var name in defaults) {
				if (options[name] === undefined) {
					options[name] = defaults[name];
				}
			}


			var filename = options.filename;


			try {
				
				var Render = compiler(source, options);
				
				
				
			} catch (e) {
			
				e.filename = filename || 'anonymous';
				e.name = 'Syntax Error';

				return showDebugInfo(e);
				
			}
			
			
			// 对编译结果进行一次包装

			function render (data) {
				
				try {
					
					return new Render(data, filename) + '';
					
				} catch (e) {
					
					// 运行时出错后自动开启调试模式重新编译
					if (!options.debug) {
						options.debug = true;
						return compile(source, options)(data);
					}
					
					return showDebugInfo(e)();
					
				}
				
			}
			

			render.prototype = Render.prototype;
			render.toString = function () {
				return Render.toString();
			};


			if (filename && options.cache) {
				cacheStore[filename] = render;
			}
			
			

			
			return render;

		};




		// 数组迭代
		var forEach = utils.$each;


		// 静态分析模板变量
		var KEYWORDS =
			// 关键字
			'break,case,catch,continue,debugger,default,delete,do,else,false'
			+ ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
			+ ',throw,true,try,typeof,var,void,while,with'

			// 保留字
			+ ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
			+ ',final,float,goto,implements,import,int,interface,long,native'
			+ ',package,private,protected,public,short,static,super,synchronized'
			+ ',throws,transient,volatile'

			// ECMA 5 - use strict
			+ ',arguments,let,yield'

			+ ',undefined';

		var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g;
		var SPLIT_RE = /[^\w$]+/g;
		var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
		var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
		var BOUNDARY_RE = /^,+|,+$/g;


		// 获取变量
		function getVariable (code) {
			return code
			.replace(REMOVE_RE, '')
			.replace(SPLIT_RE, ',')
			.replace(KEYWORDS_RE, '')
			.replace(NUMBER_RE, '')
			.replace(BOUNDARY_RE, '')
			.split(/^$|,+/);
		};


		// 字符串转义
		function stringify (code) {
			return "'" + code
			// 单引号与反斜杠转义
			.replace(/('|\\)/g, '\\$1')
			// 换行符转义(windows + linux)
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n') + "'";
		}


		function compiler (source, options) {
			
			var debug = options.debug;
			var openTag = options.openTag;
			var closeTag = options.closeTag;
			var parser = options.parser;
			var compress = options.compress;
			var escape = options.escape;
			

			
			var line = 1;
			var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};
			


			var isNewEngine = ''.trim;// '__proto__' in {}
			var replaces = isNewEngine
			? ["$out='';", "$out+=", ";", "$out"]
			: ["$out=[];", "$out.push(", ");", "$out.join('')"];

			var concat = isNewEngine
				? "$out+=text;return $out;"
				: "$out.push(text);";
				  
			var print = "function(){"
			+      "var text=''.concat.apply('',arguments);"
			+       concat
			+  "}";

			var include = "function(filename,data){"
			+      "data=data||$data;"
			+      "var text=$utils.$include(filename,data,$filename);"
			+       concat
			+   "}";

			var headerCode = "'use strict';"
			+ "var $utils=this,$helpers=$utils.$helpers,"
			+ (debug ? "$line=0," : "");
			
			var mainCode = replaces[0];

			var footerCode = "return new String(" + replaces[3] + ");"
			
			// html与逻辑语法分离
			forEach(source.split(openTag), function (code) {
				code = code.split(closeTag);
				
				var $0 = code[0];
				var $1 = code[1];
				
				// code: [html]
				if (code.length === 1) {
					
					mainCode += html($0);
				 
				// code: [logic, html]
				} else {
					
					mainCode += logic($0);
					
					if ($1) {
						mainCode += html($1);
					}
				}
				

			});
			
			var code = headerCode + mainCode + footerCode;
			
			
			
			// 调试语句
			if (debug) {
				code = "try{" + code + "}catch(e){"
				+       "throw {"
				+           "filename:$filename,"
				+           "name:'Render Error',"
				+           "message:e.message,"
				+           "line:$line,"
				+           "source:" + stringify(source)
				+           ".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')"
				+       "};"
				+ "}";
			}
			
			
			
			try {
				
				
				var Render = new Function("$data", "$filename", code);
				Render.prototype = utils;
				return Render;
				
			} catch (e) {
				e.temp = "function anonymous($data,$filename) {" + code + "}";
				throw e;
			}



			
			// 处理 HTML 语句
			function html (code) {
				
				// 记录行号
				line += code.split(/\n/).length - 1;

				// 压缩多余空白与注释
				if (compress) {
					code = code
					.replace(/[\n\r\t\s]+/g, ' ')
					.replace(/<!--.*?-->/g, '');
				}
				
				if (code) {
					code = replaces[1] + stringify(code) + replaces[2] + "\n";
				}

				return code;
			}
			
			
			// 处理逻辑语句
			function logic (code) {

				var thisLine = line;
			   
				if (parser) {
				
					 // 语法转换插件钩子
					code = parser(code, options);
					
				} else if (debug) {
				
					// 记录行号
					code = code.replace(/\n/g, function () {
						line ++;
						return "$line=" + line +  ";";
					});
					
				}
				
				
				// 输出语句. 编码: <%=value%> 不编码:<%=#value%>
				// <%=#value%> 等同 v2.0.3 之前的 <%==value%>
				if (code.indexOf('=') === 0) {

					var escapeSyntax = escape && !/^=[=#]/.test(code);

					code = code.replace(/^=[=#]?|[\s;]*$/g, '');

					// 对内容编码
					if (escapeSyntax) {

						var name = code.replace(/\s*\([^\)]+\)/, '');

						// 排除 utils.* | include | print
						
						if (!utils[name] && !/^(include|print)$/.test(name)) {
							code = "$escape(" + code + ")";
						}

					// 不编码
					} else {
						code = "$string(" + code + ")";
					}
					

					code = replaces[1] + code + replaces[2];

				}
				
				if (debug) {
					code = "$line=" + thisLine + ";" + code;
				}
				
				// 提取模板中的变量名
				forEach(getVariable(code), function (name) {
					
					// name 值可能为空，在安卓低版本浏览器下
					if (!name || uniq[name]) {
						return;
					}

					var value;

					// 声明模板变量
					// 赋值优先级:
					// [include, print] > utils > helpers > data
					if (name === 'print') {

						value = print;

					} else if (name === 'include') {
						
						value = include;
						
					} else if (utils[name]) {

						value = "$utils." + name;

					} else if (helpers[name]) {

						value = "$helpers." + name;

					} else {

						value = "$data." + name;
					}
					
					headerCode += name + "=" + value + ",";
					uniq[name] = true;
					
					
				});
				
				return code + "\n";
			}
			
			
		};



		// 定义模板引擎的语法


		defaults.openTag = '{';
		defaults.closeTag = '}';


		var filtered = function (js, filter) {
			var parts = filter.split(':');
			var name = parts.shift();
			var args = parts.join(':') || '';

			if (args) {
				args = ', ' + args;
			}

			return '$helpers.' + name + '(' + js + args + ')';
		}


		defaults.parser = function (code, options) {
			code = code.replace(/^\s/, '');
			
			var split = code.split(' ');
			var key = split.shift();
			var args = split.join(' ');

			switch (key) {

				case 'if':

					code = 'if(' + args + '){';
					break;

				case 'else':
					
					if (split.shift() === 'if') {
						split = ' if(' + split.join(' ') + ')';
					} else {
						split = '';
					}

					code = '}else' + split + '{';
					break;

				case '/if':

					code = '}';
					break;

				case 'each':
					
					var object = split[0] || '$data';
					var as     = split[1] || 'as';
					var value  = split[2] || '$value';
					var index  = split[3] || '$index';
					
					var param   = value + ',' + index;
					
					if (as !== 'as') {
						object = '[]';
					}
					
					code =  '$each(' + object + ',function(' + param + '){';
					break;

				case '/each':

					code = '});';
					break;

				case 'echo':

					code = 'print(' + args + ');';
					break;

				case 'print':
				case 'include':

					code = key + '(' + split.join(',') + ');';
					break;

				default:

					// 过滤器（辅助方法）
					// {{value | filterA:'abcd' | filterB}}
					// >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
					if (args.indexOf('|') !== -1) {

						var escape = options.escape;

						// {{#value | link}}
						if (code.indexOf('#') === 0) {
							code = code.substr(1);
							escape = false;
						}

						var i = 0;
						var array = code.split('|');
						var len = array.length;
						var pre = escape ? '$escape' : '$string';
						var val = pre + '(' + array[i++] + ')';

						for (; i < len; i ++) {
							val = filtered(val, array[i]);
						}

						code = '=#' + val;

					// 即将弃用 {{helperName value}}
					} else if (template.helpers[key]) {
						
						code = '=#' + key + '(' + split.join(',') + ');';
					
					// 内容直接输出 {{value}}
					} else {

						code = '=' + code;
					}

					break;
			}

			return code;
		};
		return template;
	})();
	
	var util = (function(){
		var util = {};

		util.type = function(obj) {
			return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
		}

		util.isArray = function(list) {
			return util.type(list) === 'Array';
		}

		util.isString = function(list) {
			return util.type(list) == 'String';
		}

		util.each = function(array, fn) {
			for (var i = 0, len = array.length; i < len; i++) {
				fn(array[i], i);
			}
		}

		util.toArray = function(listLike) {
			if (!listLike) {
				return [];
			}
			var list = [];
			for (var i = 0, len = listLike.length; i < len; i++) {
				list.push(listLike[i]);
			}
			return list;
		}

		util.setAttr = function(node, key, value) {
			switch (key) {
				case 'style':
					node.style.cssText = value;
					break;
				case 'value':
					var tagName = node.tagName || '';
					tagName = tagName.toLowerCase();
					if (tagName === 'input' || tagName === 'textarea') {
						node.value = value;
					} else {
						node.setAttribute(key, value);
					}
					break;
				default:
					node.setAttribute(key, value);
					break;
			}
		}
		util.clone  = function (obj) {  
			var newObj = {};  
			if (Array == obj.constructor) {  
				newObj = [];  
			}  
			for (var key in obj) {  
				var val = obj[key];  
				newObj[key] = typeof val === 'object' ? util.clone(val): val;  
			}  
			return newObj;  
		};
		util.extend = function (dest, src) {
		  for (var key in src) {
			if (src.hasOwnProperty(key)) {
			  dest[key] = src[key]
			}
		  }
		  return dest
		};
		var nextTick = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame

		if (nextTick) {
			util.nextTick = function () {
				nextTick.apply(window, arguments)
			}
		} else {
			util.nextTick = function (func) {
				setTimeout(func)
			}
		};
		return util;
	})();
	
	var VElement = (function(){
		//虚拟dom
		var VElement = function(tagName, props, children) {
			//保证只能通过如下方式调用：new VElement
			if (!(this instanceof VElement)) {
				return new VElement(tagName, props, children);
			}

			//可以通过只传递tagName和children参数
			if (util.isArray(props)) {
				children = props;
				props = {};
			}

			//设置虚拟dom的相关属性
			this.tagName = tagName;
			this.props = props || {};
			this.children = children || [];
			this.key = props ? props.key : void 666;
			var count = 0;
			util.each(this.children, function(child, i) {
				if (child instanceof VElement) {
					count += child.count;
				} else {
					children[i] = '' + child;
				}
				count++;
			});
			this.count = count;
		}

		//根据虚拟dom创建真实dom
		VElement.prototype.render = function() {
			
			 
			//创建标签
			var el = document.createElement(this.tagName);
			//设置标签的属性
			var props = this.props;
			
			for (var propName in props) {
				var propValue = props[propName]
				util.setAttr(el, propName, propValue);
			}

			//一次创建子节点的标签
			util.each(this.children, function(child) {
				//如果子节点仍然为velement，则递归的创建子节点，否则直接创建文本类型节点
				var childEl = (child instanceof VElement) ? child.render() : document.createTextNode(child);
				el.appendChild(childEl);
			});

			return el;
		};
		return VElement;
	})();
	
	var patch = (function(){
		//用于记录两个虚拟dom之间差异的数据结构
		//每个节点有四种变动
		var REPLACE = 0;
		var REORDER = 1;
		var PROPS = 2;
		var TEXT = 3;

		function patch(node, patches) {
			var walker = {
				index: 0
			};
			dfsWalk(node, walker, patches);
		}

		patch.REPLACE = REPLACE;
		patch.REORDER = REORDER;
		patch.PROPS = PROPS;
		patch.TEXT = TEXT;

		//深度优先遍历dom结构
		function dfsWalk(node, walker, patches) {
			var currentPatches = patches[walker.index];
			
			var len = node.childNodes ? node.childNodes.length : 0;
			for (var i = 0; i < len; i++) {
				var child = node.childNodes[i];
				walker.index++;
				dfsWalk(child, walker, patches);
			}
			//如果当前节点存在差异
			if (currentPatches) {
				applyPatches(node, currentPatches);
			}
		}

		function applyPatches(node, currentPatches) {
			util.each(currentPatches, function(currentPatch) {
				switch (currentPatch.type) {
					case REPLACE:
						var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
						node.parentNode.replaceChild(newNode, node);
						break;
					case REORDER:
						reoderChildren(node, currentPatch.moves);
						break;
					case PROPS:
						setProps(node, currentPatch.props);
						break;
					case TEXT:
						if (node.textContent) {
							node.textContent = currentPatch.content;
						} else {
							node.nodeValue = currentPatch.content;
						}
						break;
					default:
						throw new Error('Unknow patch type ' + currentPatch.type);
				}
			});
		}

		function reoderChildren(node, moves) {
			
			var staticNodeList = util.toArray(node.childNodes);
			var maps = {};
			util.each(staticNodeList, function(node) {
				if (node.nodeType === 1) {
					var key = node.getAttribute('key');
					if (key) {
						maps[key] = node;
					}
				}
			});

			util.each(moves, function(move) {
				var index = move.index;
				if (move.type === 0) { // 变动类型为删除节点
					if (staticNodeList[index] === node.childNodes[index]) {
						node.removeChild(node.childNodes[index]);
					}
					staticNodeList.splice(index, 1);
				} else {
					var insertNode = maps[move.item.key] 
						? maps[move.item.key] : (typeof move.item === 'object') 
						? move.item.render() : document.createTextNode(move.item);
					staticNodeList.splice(index, 0, insertNode);
					node.insertBefore(insertNode, node.childNodes[index] || null);
				}
			});
		}


		function setProps(node, props) {
			for (var key in props) {
				if (props[key] === void 666) {
					node.removeAttribute(key);
				} else {
					var value = props[key];
					util.setAttr(node, key, value);
				}
			}
		}
		return patch;
	})();
	
	var listDiff = (function(){
		function listDiff (oldList, newList, key) {
			var oldMap = makeKeyIndexAndFree(oldList, key)
			var newMap = makeKeyIndexAndFree(newList, key)

			var newFree = newMap.free

			var oldKeyIndex = oldMap.keyIndex
			var newKeyIndex = newMap.keyIndex

			var moves = []

			// a simulate list to manipulate
			var children = []
			var i = 0
			var item
			var itemKey
			var freeIndex = 0

			// fist pass to check item in old list: if it's removed or not
			while (i < oldList.length) {
				item = oldList[i]
				itemKey = getItemKey(item, key)
				if (itemKey) {
				  if (!newKeyIndex.hasOwnProperty(itemKey)) {
					children.push(null)
				  } else {
					var newItemIndex = newKeyIndex[itemKey]
					children.push(newList[newItemIndex])
				  }
				} else {
				  var freeItem = newFree[freeIndex++]
				  children.push(freeItem || null)
				}
				i++
			}

			var simulateList = children.slice(0)

			// remove items no longer exist
			i = 0
			while (i < simulateList.length) {
				if (simulateList[i] === null) {
				  remove(i)
				  removeSimulate(i)
				} else {
				  i++
				}
			}

			// i is cursor pointing to a item in new list
			// j is cursor pointing to a item in simulateList
			var j = i = 0
			while (i < newList.length) {
				item = newList[i]
				itemKey = getItemKey(item, key)

				var simulateItem = simulateList[j]
				var simulateItemKey = getItemKey(simulateItem, key)

				if (simulateItem) {
				  if (itemKey === simulateItemKey) {
					j++
				  } else {
					// new item, just inesrt it
					if (!oldKeyIndex.hasOwnProperty(itemKey)) {
					  insert(i, item)
					} else {
					  // if remove current simulateItem make item in right place
					  // then just remove it
					  var nextItemKey = getItemKey(simulateList[j + 1], key)
					  if (nextItemKey === itemKey) {
						remove(i)
						removeSimulate(j)
						j++ // after removing, current j is right, just jump to next one
					  } else {
						// else insert item
						insert(i, item)
					  }
					}
				  }
				} else {
				  insert(i, item)
				}

				i++
			}

			function remove (index) {
				var move = {index: index, type: 0}
				moves.push(move)
			}

			function insert (index, item) {
				var move = {index: index, item: item, type: 1}
				moves.push(move)
			}

			function removeSimulate (index) {
				simulateList.splice(index, 1)
			}

			return {
				moves: moves,
				children: children
			}
		}

		/**
		 * Convert list to key-item keyIndex object.
		 * @param {Array} list
		 * @param {String|Function} key
		 */
		function makeKeyIndexAndFree (list, key) {
		  var keyIndex = {}
		  var free = []
		  for (var i = 0, len = list.length; i < len; i++) {
			var item = list[i]
			var itemKey = getItemKey(item, key)
			if (itemKey) {
			  keyIndex[itemKey] = i
			} else {
			  free.push(item)
			}
		  }
		  return {
			keyIndex: keyIndex,
			free: free
		  }
		}

		function getItemKey (item, key) {
		  if (!item || !key) return void 666
		  return typeof key === 'string'
			? item[key]
			: key(item)
		}
		return listDiff;
	})();
	
	var diff = (function(){
		function diff(oldTree, newTree) {
			var index = 0;
			var patches = {};
			dfsWalk(oldTree, newTree, index, patches);
			return patches;
		}


		function dfsWalk(oldNode, newNode, index, patches) {
			var currentPatch = [];
			if (newNode === null) {
				//依赖listdiff算法进行标记为删除
			} else if (util.isString(oldNode) && util.isString(newNode)) {
				if (oldNode !== newNode) {
					//如果是文本节点则直接替换文本
					currentPatch.push({
						type: patch.TEXT,
						content: newNode
					});
				}
			} else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
				//节点类型相同
				//比较节点的属性是否相同
				var propsPatches = diffProps(oldNode, newNode);
				if (propsPatches) {
					currentPatch.push({
						type: patch.PROPS,
						props: propsPatches
					});
				}
				//比较子节点是否相同
				diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
			} else {
				//节点的类型不同，直接替换
				currentPatch.push({ type: patch.REPLACE, node: newNode });
			}

			if (currentPatch.length) {
				patches[index] = currentPatch;
			}
		}

		function diffProps(oldNode, newNode) {
			var count = 0;
			var oldProps = oldNode.props;
			var newProps = newNode.props;
			var key, value;
			var propsPatches = {};

			//找出不同的属性
			for (key in oldProps) {
				value = oldProps[key];
				if (newProps[key] != value) {
					count++;
					propsPatches[key] = newProps[key];
				}
			};

			//找出新增的属性
			for (key in newProps) {
				value = newProps[key];
				if (!oldProps.hasOwnProperty(key)) {
					count++;
					propsPatches[key] = newProps[key];
				}
			}

			if (count === 0) {
				return null;
			}

			return propsPatches;
		}


		function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
			var diffs = listDiff(oldChildren, newChildren, 'key');
			newChildren = diffs.children;

			if (diffs.moves.length) {
				var reorderPatch = {
					type: patch.REORDER,
					moves: diffs.moves
				};
				currentPatch.push(reorderPatch);
			}

			var leftNode = null;
			var currentNodeIndex = index;
			util.each(oldChildren, function(child, i) {
				var newChild = newChildren[i];
				currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
				dfsWalk(child, newChild, currentNodeIndex, patches);
				leftNode = child;
			});
		}
		return diff;
	})();
	
	var h2v = (function(){
		function h2v (html) {
		  var root = $(html)[0]
		  return {
			vdom: toVirtualDOM(root),
			dom: root
		  }
		}

		function toVirtualDOM (dom) {
		  var tagName = dom.tagName.toLowerCase()
		  var props = attrsToObj(dom)
		  var children = []
		  for (var i = 0, len = dom.childNodes.length; i < len; i++) {
			var node = dom.childNodes[i]
			// TEXT node
			if (node.nodeType === 3) {
			  if (node.nodeValue) {
				children.push(node.nodeValue)
			  } else {
				children.push(node.textContent)
			  }
			} else {
			  children.push(toVirtualDOM(node))
			}
		  }
		  return VElement(tagName, props, children)
		}

		function attrsToObj (dom) {
		  var attrs = dom.attributes
		  var props = {}
		  for (var i = 0, len = attrs.length; i < len; i++) {
			var name = attrs[i].name
			var value = attrs[i].value
			if (value && value !== 'null') {
			  props[name] = value
			}
		  }
		  if (dom.style.cssText) {
			props.style = dom.style.cssText
		  }
		  return props
		}
		return h2v;
	})();
	
	var vTemplate = (function(){
		function makeTemplateClass (compileFn) {
		  function VirtualTemplate (data) {
			this.data = data
			var domAndVdom = this.makeVirtualDOM()
			this.vdom = domAndVdom.vdom
			this.dom = domAndVdom.dom
			this.isDirty = false
			this.flushCallbacks = []
		  }
		  
		 

		  util.extend(VirtualTemplate.prototype, {
			compileFn: compileFn,
			setData: setData,
			makeVirtualDOM: makeVirtualDOM,
			flush: flush
		  })

		  return VirtualTemplate
		}

		function setData (data, isSync) {
		  util.extend(this.data, data)
		  if (typeof isSync === 'boolean' && isSync) {
			this.flush()
		  } else if (!this.isDirty) {
			this.isDirty = true
			var self = this
			// cache all data change, and only refresh dom before browser's repainting
			util.nextTick(function () {
			  self.flush()
			})
		  }
		  if (typeof isSync === 'function') {
			var callback = isSync
			this.flushCallbacks.push(callback)
		  }
		}

		function flush () {
		  // run virtual-dom algorithm
		  var newVdom = this.makeVirtualDOM().vdom
		  var patches = diff(this.vdom, newVdom)
		  patch(this.dom, patches)
		  this.vdom = newVdom
		  this.isDirty = false
		  var callbacks = this.flushCallbacks
		  for (var i = 0, len = callbacks.length; i < len; i++) {
			if (callbacks[i]) {
			  callbacks[i]()
			}
		  }
		  this.flushCallbacks = []
		}

		function makeVirtualDOM () {
		  var html = this.compileFn(this.data)
		  return h2v(html)
		} 

		return function (compileFn, data) {
		  var VirtualTemplate = makeTemplateClass(compileFn)
		  return data
			? new VirtualTemplate(data)
			: VirtualTemplate
		}
	})();
	
	var template = function(source,data) {
		return new template.fn.init(source,data);
	};
	
	template.fn = template.prototype = {
		constructor: template,
		init:function(source,data) {
			var compiled = function(){
				var compiler = artTemplate.compile(source);
				
				return vTemplate(compiler, data);
			};
			compiled = compiled();
			this.dom = compiled.dom;
			this.setData = function(data,callback){
				compiled.setData(data,callback);
				return this;
			}
			return this;
		}
	}
	template.config = function(options){
		for(var i in options){
			artTemplate.config(i,options[i])
		}
		
	}
	template.fn.init.prototype = template.fn;

	module.exports = template;
});
fui.extend({template:fui.require('template')});
