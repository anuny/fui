fui.define('core/base',function( module ){	
	"use strict";
	var win = window,
	doc = win.document,
	$ = window['fuijQuery']||window['jQuery'],	
	
	$head = $('head'),
	
	scripts = doc.scripts,
	libScript = scripts[scripts.length-1],
	scriptSrc = libScript.src,
	path = scriptSrc.substring(0,scriptSrc.lastIndexOf("/")+1),

	// 文件dom对象
	$libScript = $(libScript),

	// 语言
	lang  = $libScript.attr('fui-lang'),

	// 调试
	debug = $libScript.attr('fui-debug'),
	
	debug = debug == 'true' ? true : false,

	// 模式
	mode  = $libScript.attr('fui-mode'),

	// 主题
	theme = $libScript.attr('fui-theme'),

	uid = function (){
		return '0101100101011010'.replace(/[01]/g, function(c) {
			var r = Math.random() * 16 | 0,v = c == '0' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	
	thisUid = uid(),
	
	isUrl = function (uri){
        var reg =new RegExp("^((.*\:)?//)");
		return reg.test(uri)
	},		

	load = function(type,url,id){

		if(!isUrl(url)){
			url = path + url;
		}
		

		if(debug){
			var nocache = 'nocache=' + thisUid;
			url += url.indexOf('?')>-1?(url.indexOf('nocache=')==-1?'&'+nocache:''):'?' + nocache;
		}

		var fileId = id ? ' id="'+id+'"':'';
		var $id = $('#'+id);

		if(type==='js'){
			
			if($id.length){
				$id.attr('src',url)
			}else{
				var script = '<script type="text/javascript" src="'+url+'"'+ fileId+'></script>';
				
				var $lang = $('#fui-lang-'+fui.uid);
				if($lang.length){
					$lang.after(script);
				}else{
					$libScript.after(script);
				}	
			}
		}else if(type==='css'){
			if($id.length){
				$id.attr('href',url)
			}else{
				$head.append('<link href="'+url+'" rel="stylesheet" type="text/css"'+fileId+'>');
			}
		}
		return this;
	},	
	isJquery = function(node){
		if(node instanceof $){
			return true
		}
		return false
	},
	getFix = function(array){
		return this.fix + array.join(this.splitter);
	},
	components = {
		compiled  : {},
		classes   : {},
		uiClasses : {},
		layouts   : {}
	};
	
	module.exports = {
		base       : {},
		plugins    : {},
		components : components,
		creatUid   : uid,
		fix        : "fui-",
		splitter   : '-',
		getFix     : getFix,
		uid        : thisUid,
		path       : path,
		lang       : lang || 'zh',
		ready      : false,
		debug      : debug,
		mode       : mode || 'default',
		theme      : theme || 'default',
		load       : load,
		jQuery     : $,
		isJquery   : isJquery,
		version    : '__FUI__VERSION__'
	};               
	components = null;
});
fui.extend(fui.require('core/base'));




