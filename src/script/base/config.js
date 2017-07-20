fui.define('core/config',function( module ){

	'use strict';
	
	var $ = fui.dom,
	
	uid = fui.uid;
	
	// 加载语言包
	fui.load('js',getUrl('lang',fui.lang),'fui-lang-'+uid);

	// 加载基础样式
	//fui.load('css',getUrl('theme','default'),'fui-theme-default-'+uid);
	
	// 加载主题
	if(fui.theme!=='default'){
		fui.load('css',getUrl('theme',fui.theme),'fui-theme-'+uid);
	};

	// 加载模式
	if(fui.mode!=='default'){
		fui.load('css',getUrl('mode',fui.mode),'fui-mode-'+uid);
	};

	
	// 获取文件地址
	function getUrl(type,name){
		var urls = {
			'lang'  : 'lang/' + name +'.js',
			'theme' : 'theme/' + name +'/css/theme.css',
			'mode'  : 'theme/' + fui.theme + '/css/mode.' + name +'.css'
		};
		return urls[type];
	}
	
	function set(type,name){
		var id = 'fui-'+ type +'-'+ uid;
		var css = $('#'+id);
		
		if(name == 'default'){
			// 默认
			if(css.length) css.remove();
		}else{
			// 设置
			var path = getUrl(type,name);
			fui.load('css',path,id);
		};
		return name;
	}

	
	// 设置主题
	function setTheme(theme){
		fui.theme = set('theme',theme);
	}
	
	// 设置模式
	function setMode(mode){
		fui.mode = set('mode',mode);
	}
	module.exports = {setTheme:setTheme, setMode:setMode};	
});
fui.extend(fui.require('core/config'));



