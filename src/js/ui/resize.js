fui.define('fui/core/resize',function( module ){

	var util = fui.util;
	
	var resize = function(option) {
		return new resize.fn.init(option);
	};
	resize.fn = resize.prototype = {
		constructor: resize,
		init:function(option) {
			fui.extend(this,option);
			this.doResize();
			return this;
		},
		_creatProxy:function(hidePanel,cursor){
			var offset = this.target.offset();
			var clone  = this.target.clone();
			var idName = 'fui-proxy-'+this.uid;
			clone.attr('id',idName).css({cursor:cursor,left:offset.left,top:offset.top}).addClass('fui-panel-proxy')
			.html('<div class="fui-panel-proxy-border"></div><div class="fui-panel-proxy-inner" style="filter:alpha(opacity=20);"></div>');
			this.body.append(clone);
			if(hidePanel) this.target.css({'visibility':'hidden'});
			this.proxy = clone;
		},
		doResize:function(){

			var self = this;

			// 阻止冒泡
			var retFalse = function(e){
				return false;
			}
			
			var CX=0,CY=0,optW=0,optH=0,minW=0,minH=0,maxW=0,maxH=0;
			
			// 点击鼠标
			var mouseDown = function(e){
				
				optW = self.width;
				optH = self.height;
				minW = self.minWidth;
				minH = self.minHeight;
				maxW = self.maxWidth;
				maxH = self.maxHeight;
				
				// 计算最大宽度
				if(maxW && (maxW<=optW || maxW<=minW)){
					maxW = optW
				}
				
				// 计算最大高度
				if(maxH && (maxH<=optH || maxH<=minH)){
					maxH = optH
				}
				
				
				self.doc.on('selectstart',retFalse);
				console.log(self.isProxy)
				if(self.isProxy){
					// 创建代理
					self._creatProxy(false,'nw-resize');
				}

				
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
				
				
				if(self.isProxy){
					// 设置代理宽度和高度
					self.proxy.css({width:W,height:H});
				}else{
					// 设置面板宽度
					self.target.css({width:W,height:H});
				}
				
				self.width = W;
				self.height = H;
				return false;
			}

			// 放开鼠标
			var mouseUp=function(e){

				if(self.isProxy){
					self.target.css({width:self.width,height:self.height});
					self.proxy.remove();
				}

				self.callback(self.width,self.height);

				// 销毁绑定
				self.doc.off('selectstart',retFalse).off('mousemove',mouseMove).off('mouseup',mouseUp)
				return false;
			}
			
			// 绑定对象
			this.part.bind('mousedown',function(e){
				mouseDown(e);
				self.doc.on('mousemove',mouseMove).on('mouseup',mouseUp);
				return false;
			})	
		},
		set:function(option){
			fui.extend(this,option);
		}
	};
	resize.fn.init.prototype = resize.fn;
	module.exports = resize;
});
// 注册 window
fui.extend({resize:fui.require('fui/core/resize')});


