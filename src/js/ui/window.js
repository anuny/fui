fui.define('fui/core/window',function( module ){

	var util = fui.util;
	
	var windows = function(option) {
		return new windows.fn.init(option);
	};
	windows.fn = windows.prototype = {
		constructor: windows,
		init:function(option) {
			var panel = fui.panel(option);
			this.el = panel.el;
			this.uid = panel.uid;
			this.options = panel.options;
			this._doLayout();
			return this;
		},
		_doLayout:function(){
			
			this._setPosition();
			
			if(this.options.move){
				var move = fui.move({
					uid:this.uid,
					win:this.el.win,
					doc:this.el.doc,
					body:this.el.body,
					target : this.el.panel,
					part   : this.el.header,
					isProxy : this.options.proxy,
					docWidth:this.options.docWidth,
					docHeight:this.options.docHeight,
					left:this.options.left,
					top:this.options.top,
					// 宽度
					width: this.options.width,
					
					// 高度
					height: this.options.height,
					
					// 最小宽度
					minWidth: this.options.minWidth,
					
					// 最小高度
					minHeight: this.options.minHeight,
					callback:function(width,height){
						
					}
				});
				console.log(move)
			};
			
		},
		// 获取面板坐标
		_getPosition:function(){
			var docWidth = this.el.doc.width();
			var docHeight= this.el.doc.height();
			
			var options = this.options;
			var option = {};
			
			this.options.docWidth = docWidth;
			this.options.docHeight = docHeight;
			
			// X坐标
			switch(options.x){
				case 'left':
				option.left = 0
			break;
				case 'right':
				option.left = docWidth - options.width
			break;
				case 'center':
				option.left = (docWidth - options.width)/2
			break;
			default:
				option.left = options.x
			}
			
			// Y坐标
			switch(options.y){
				case 'top':
				option.top = 0
			break;
				case 'bottom':
				option.top = docHeight - options.height
			break;
				case 'center':
				option.top = (docHeight - options.height)/2
			break;
			default:
				option.top = options.y
			}

			return option;
		},
		// 设置面板坐标
		_setPosition:function(){
			var position = this._getPosition();
			this.el.panel.addClass('fui-window').css({left:position.left,top:position.top});
			this.options.left = position.left;
			this.options.top  = position.top;
		}
	};
	windows.fn.init.prototype = windows.fn;
	module.exports = windows;
});
// 注册 window
fui.extend({window:fui.require('fui/core/window')});


