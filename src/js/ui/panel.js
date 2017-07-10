fui.define('fui/core/panel',function( module ){

	"use strict";

	var panel = function(option) {
		return new panel.fn.init(option);
	};
	// 获取语言包
	var lang = fui.require('fui/lang');
	
	
	panel.fn = panel.prototype = {
		constructor: panel,
		init:function(option) {
			
			// 唯一ID
			var uid = fui.creatUid();
			this.uid = uid;
			
			option = option || {};
			
			option.id = {
				// 面板ID
				panel    : this._getId('panel'),
				
				// 头部ID
				header   : this._getId('header'),
				
				// 内容ID
				viewport : this._getId('viewport'),
				
				// 底部ID
				footer   : this._getId('footer'),
				
				// 缩放ID
				resize   : this._getId('resize')
			};

			
			fui.extend(this.options,option);

			// 获取模板渲染
			var tpl = this._getTemplate();
			this.panel = fui.template(tpl,this.options);
			
			var self = this;
			
			var $body = $('body');
				
			// 渲染面板
			$body.append(self.panel.dom);
			
			
			// 获取面板jquery对象
			self.el = {
				win      : $(fui.win),
				doc      : $(fui.doc),
				body     : $body,
				panel    : self._getId('panel',true),
				header   : self._getId('header',true),
				viewport : self._getId('viewport',true),
				footer   : self._getId('footer',true),
				resize   : self._getId('resize',true)
			};
			
			self._doLayout();
			
			return this;
		},
		options:{
			// 标题
			title:'',
			
			// 内容
			content:'',
			
			// 宽度
			width:200,
			
			// 高度
			height:200,
			
			// 最小宽度
			minWidth:180,
			
			// 最小高度
			minHeight:80,
			
			// 是否调整大小
			resize: true,
			
			proxy: true,
			
			// 关闭按钮
			closeBtn:true,
			
			// 缩放按钮
			scaleBtn:true
		},
		_getId:function(name,jquery){
			var id = 'fui-panel-' + (name == 'panel' ? '' : name+ '-') + this.uid;
			return jquery ? $('#'+id) : id;
		},
		// 面板模板
		_getTemplate:function(){
			var borderType = ['header-left','header-top','header-right','header-bottom','viewport-left','viewport-right',
			'footer-left','footer-top','footer-right','footer-bottom'];
			var border = (function(){
				var ret='';
				$(borderType).each(function(i,ele){
					ret+='<div class="fui-panel-border-'+ ele +'"></div>'
				});
				return ret;
			})();
			
			var tpl 
			= '<div class="fui-panel" id="{id.panel}" style="width:{width}px;height:{height}px">'
			+'    <div class="fui-panel-header {if move} fui-drag{/if}" id="{id.header}">'
			+'      <div class="fui-panel-header-inner">'
			+'        <div class="fui-panel-title">{#title||"&nbsp;"}</div>'
			+'        <div class="fui-panel-tools">'
			+'        {each buttons.header}<input type="button" value="{$value.title}" />{/each}'
			+'        </div>'
			+'      </div>'
			+'    </div>'
			+'    <div class="fui-panel-viewport" id="{id.viewport}">'
			+'      <div class="fui-panel-viewport-inner">{#content}</div>'
			+'    </div>'
			+'    <div class="fui-panel-footer" id="{id.footer}">'
			+'      <div class="fui-panel-footer-inner">'
			+'        {each buttons.footer}<input type="button" value="{$value.title}" />{/each}'
			+'      </div>'
			+'    </div>'
			+'  <div class="fui-panel-border">'+ border +'</div>'
			+'  {if resize}<div id="{id.resize}" class="fui-panel-resize"></div>{/if}'
			+'</div>';
			return tpl;
		},
		_doLayout:function(){
			var self = this;
			if(this.options.resize){
				fui.resize({
					uid:this.uid,
					win:this.el.win,
					doc:this.el.doc,
					body:this.el.body,
					target : this.el.panel,
					part   : this.el.resize,
					isProxy : this.options.proxy,
					// 宽度
					width: this.options.width,
					
					// 高度
					height: this.options.height,
					
					// 最小宽度
					minWidth: this.options.minWidth,
					
					// 最小高度
					minHeight: this.options.minHeight,
					callback:function(width,height){
						self.options.width = width
						self.options.height = height
					}
				});
			};
		}
	}
	panel.fn.init.prototype = panel.fn;
	module.exports = panel
});

// 注册 panel
fui.extend({panel:fui.require('fui/core/panel')});
