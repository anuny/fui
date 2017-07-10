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
				
				// 边框ID
				border   : this._getId('border'),
				
				// 头部ID
				header   : this._getId('header'),
				
				// 内容ID
				viewport : this._getId('viewport'),
				
				// 底部ID
				footer   : this._getId('footer'),
				
				// 代理ID
				proxy    : this._getId('proxy'),
				
				// 缩放ID
				resize   : this._getId('resize')
			};
			
			fui.extend(this.options,option);
			
			// 获取模板渲染
			var tpl = this._getTemplate();
			this.panel = fui.template(tpl,this.options);
			
			var self = this;
			$(fui.win).load(function(){
				var $body = $('body');
				
				// 渲染面板
				$body.append(self.panel.dom);
				
				// 获取面板jquery对象
				self.el = {
					win      : $(this),
					doc      : $(fui.doc),
					body     : $body,
					panel    : self._getId('panel',true),
					border   : self._getId('border',true),
					header   : self._getId('header',true),
					viewport : self._getId('viewport',true),
					footer   : self._getId('footer',true),
					resize   : self._getId('resize',true)
				};
				
				// 面板布局
				self._doLayout();	
			});
			
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
			
			// 左距离
			left:0,
			
			// 顶距离
			top:0,
			
			// 水平位置
			x:'center',
			
			// 垂直位置
			y:'center',
			
			// 是否调整大小
			resize: true,
			
			// 是否拖动位置
			move: true,
			
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
			var tpl 
			= '<div class="fui-panel {if type=="window"}fui-window{/if}" id="{id.panel}" style="width:{width}px;height:{height}px">'
			+'  <div class="fui-panel-border" id="{id.border}">'
			+'    <div class="fui-panel-header {if move} fui-drag{/if}" id="{id.header}">'
			+'      <div class="fui-panel-header-inner">'
			+'        <div class="fui-panel-title">{#title||"&nbsp;"}</div>'
			+'        <div class="fui-panel-tools">'
			+'        {each buttons.header}<input type="button" value="{$value.title}" />{/each}'
			+'        </div>'
			+'    </div>'
			+'  </div>'
			+'  <div class="fui-panel-viewport" id="{id.viewport}">'
			+'    <div class="fui-panel-viewport-inner">{#content}</div>'
			+'  </div>'
			+'  <div class="fui-panel-footer" id="{id.footer}">'
			+'    <div class="fui-panel-footer-inner">'
			+'      {each buttons.footer}<input type="button" value="{$value.title}" />{/each}'
			+'    </div>'
			+'  </div>'
			+'  </div>'
			+'  {if resize}<div id="{id.resize}" class="fui-panel-resize"></div>{/if}'
			+'</div>';
			return tpl;
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
			this.el.panel.css({left:position.left,top:position.top});
			this.options.left = position.left;
			this.options.top  = position.top;
		},
		// 设置面板高度
		_setHeight:function(height){
			var headerHeight = this.el.header.outerHeight();
			var footerHeight = this.el.footer.outerHeight();
			var padding = parseInt(this.el.viewport.css('padding-top'))+parseInt(this.el.viewport.css('padding-bottom'));
			var borderSize = parseInt( this.el.border.css('border-top-width'))+parseInt( this.el.border.css('border-bottom-width'));
			var panelHeight = height||this.options.height;
			this.el.viewport.height(panelHeight - headerHeight -  footerHeight - padding - borderSize);
			if(height) this.el.panel.height(height);
		},
		_doLayout:function(){
			this._setHeight();
			if(this.options.type=='window') this._setPosition();
			if(this.options.move) this.move();
			if(this.options.resize) this.resize();
		},
		
		// 创建面板移动代理层
		_creatProxy:function(hidePanel,cursor){
			var clone = this.el.panel.clone();
			var idName = this.options.id.proxy;
			clone.attr('id',idName).css({cursor:cursor}).addClass('fui-panel-proxy')
			.html('<div class="fui-panel-proxy-border"></div><div class="fui-panel-proxy-inner" style="filter:alpha(opacity=20);"></div>');
			if(this.options.type!='window'){
				var offset = this.el.panel.offset();
				this.options.left = offset.left
				this.options.top = offset.top 
			}
			this.el.body.append(clone);
			this.el.proxy = clone;
			if(hidePanel) this.el.panel.css({'visibility':'hidden'});
		},

		// 拖动面板
		move:function(){

			var self = this;
			var maxL = self.options.docWidth - self.options.width;
			var maxT = self.options.docHeight - self.options.height
			
			var X=0,Y=0;
			
			// 阻止冒泡
			var retFalse = function(e){
				return false;
			}
			
			// 点击鼠标
			var mouseDown = function(e){
				self.el.doc.on('selectstart',retFalse)
				self._creatProxy(true,'move')
				X = self.options.left - e.clientX;
				Y = self.options.top  - e.clientY;
				return false;
			}
			
			// 移动鼠标
			var mouseMove=function(e){		
				var iL = X + e.clientX ;
				var iT = Y+ e.clientY ;

				iL <= 0 && (iL = 0);
				iT <= 0 && (iT = 0);
				iL >= maxL && (iL = maxL);
				iT >= maxT && (iT = maxT);
				
				self.el.proxy.css({left:iL,top:iT});
				self.options.left = iL;
				self.options.top = iT;
				return false;
			}

			// 放开鼠标
			var mouseUp=function(e){
				self.el.panel.css({'visibility':'visible',left:self.options.left,top:self.options.top});
				self.el.proxy.remove();
				self.el.doc.off('selectstart',retFalse).off('mousemove',mouseMove).off('mouseup',mouseUp)
				return false;
			}
			
	
			self.el.doc.on('mousedown touchstart','.fui-drag',function(e){
				
				// 过滤工具栏
				var exclude = $(e.target).parents('.fui-panel-tools');
				var span = e.which!=3 && !exclude.length;
				
				if(span){
					mouseDown(e);
					self.el.doc.on('mousemove',mouseMove).on('mouseup',mouseUp);
				}else{
					
					// 过滤右键
					$(this).bind("contextmenu",retFalse);
				}
				return false;
			})
		},
		// 缩放面板
		resize:function(){
			var self = this;

			// 阻止冒泡
			var retFalse = function(e){
				return false;
			}
			
			var CX=0,CY=0,optW=0,optH=0,minW=0,minH=0,maxW=0,maxH=0;
			
			// 点击鼠标
			var mouseDown = function(e){
				
				optW = self.options.width;
				optH = self.options.height;
				minW = self.options.minWidth;
				minH = self.options.minHeight;
				maxW = self.options.maxWidth;
				maxH = self.options.maxHeight;
				
				// 计算最大宽度
				if(maxW && (maxW<=optW || maxW<=minW)){
					maxW = optW
				}
				
				// 计算最大高度
				if(maxH && (maxH<=optH || maxH<=minH)){
					maxH = optH
				}
				
				
				self.el.doc.on('selectstart',retFalse);
				
				// 创建代理
				self._creatProxy(false,'nw-resize');
				
				// 记录鼠标位置
				CX = e.clientX;
				CY = e.clientY;
				return false;
			}
			
			// 移动鼠标
			var mouseMove=function(e){
				
				// 根据鼠标位置设置宽度和高度
				var W = optW + (e.clientX - CX);
				var H = optH + (e.clientY - CY);
				
				// 根据最大宽度和高度设置宽度和高度
				W <= minW && (W = minW);
				H <= minH && (H = minH);
				W >= maxW && (W = maxW);
				H >= maxH && (H = maxH);
				
				// 设置代理宽度和高度
				self.el.proxy.css({width:W,height:H});
				self.width = W;
				self.height = H;
				return false;
			}

			// 放开鼠标
			var mouseUp=function(e){
				
				// 更新宽度和高度
				self.options.width = self.width;
				self.options.height = self.height;
				
				// 设置面板宽度
				self.el.panel.css({width:self.width});
				
				// 设置面板高度并计算内容区域高度
				self._setHeight(self.height);
				
				// 移除代理
				self.el.proxy.remove();
				
				// 销毁绑定
				self.el.doc.off('selectstart',retFalse).off('mousemove',mouseMove).off('mouseup',mouseUp)
				return false;
			}
			
			// 绑定对象
			self.el.doc.on('mousedown touchstart','#'+self.options.id.resize,function(e){
				mouseDown(e);
				self.el.doc.on('mousemove',mouseMove).on('mouseup',mouseUp);
				return false;
			})	
		}
	}
	panel.fn.init.prototype = panel.fn;
	module.exports = panel
});

// 注册 panel
fui.extend({panel:fui.require('fui/core/panel')});
