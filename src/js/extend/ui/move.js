fui.define('fui/core/move',function( module ){

	var move = function(option) {
		return new move.fn.init(option);
	};
	move.fn = move.prototype = {
		constructor: move,
		init:function(option) {
			fui.extend(this,option);
			this.doMove();
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
		doMove:function(){

			var self = this;
			
			
			var X=0,Y=0,maxL=0,maxT=0;
			
			// 阻止冒泡
			var retFalse = function(e){
				return false;
			}
			
			// 点击鼠标
			var mouseDown = function(e){
				self.doc.on('selectstart',retFalse);

				if(self.isProxy){
					// 创建代理
					self._creatProxy(true,'move');
				}

				X = self.left - e.clientX;
				Y = self.top  - e.clientY;
				return false;
			}

			// 移动鼠标
			var mouseMove=function(e){	
				maxL = self.docWidth - self.width;
				maxT = self.docHeight - self.height
				var iL = X + e.clientX ;
				var iT = Y+ e.clientY ;

				iL <= 0 && (iL = 0);
				iT <= 0 && (iT = 0);
				iL >= maxL && (iL = maxL);
				iT >= maxT && (iT = maxT);
				
				if(self.isProxy){
					self.proxy.css({left:iL,top:iT});
				}else{
					self.target.css({'visibility':'visible',left:iL,top:iT});
				}
				
				
				self.left = iL;
				self.top = iT;
				return false;
			}
			
			
			// 放开鼠标
			var mouseUp=function(e){
				
				if(self.isProxy){
					self.target.css({'visibility':'visible',left:self.left,top:self.top});
					self.proxy.remove();
				}
				self.callback(self.left,self.top);
				
				self.doc.off('selectstart',retFalse).off('mousemove',mouseMove).off('mouseup',mouseUp)
				return false;
			}

			
			
			// 绑定对象
			this.part.bind('mousedown',function(e){
				
				// 过滤工具栏
				var exclude = $(e.target).parents('.fui-panel-tools');
				var span = e.which!=3 && !exclude.length;
				
				if(span){
					mouseDown(e);
					self.doc.on('mousemove',mouseMove).on('mouseup',mouseUp);
				}else{
					// 过滤右键
					$(this).bind("contextmenu",retFalse);
				}
				return false;
			})	
		},
		set:function(option){
			fui.extend(this,option)
		}
	};
	move.fn.init.prototype = move.fn;
	module.exports = move;
});
// 注册 window
fui.extend({move:fui.require('fui/core/move')});


