(function(){
	'use strict';
	var $ = fui.dom;
	var util = fui.util;

	fui.plugin({
		module : 'plugins.table',
		extend : 'base.control',
		regCls : 'table',
		attrs  : ['width','style','id','url','data','type'],
		method : {
			init: function(node) {
				this.superclass.init.call(this,node,'<div></div>');
				this._render();
			},
			columns:[],
			_render:function(){
				var self = this;
				// 获取表头数据
				var headerData = this._getHeaderData();
				
				// 获取模板
				var hraderTpl = this._getHeaderTpl();
				var bodyTpl   = this._getBodyTpl();
				
				// 编译模板
				var headerCompiled = fui.template(hraderTpl,{
					headerData:headerData,
					len:headerData.length,
					splitter:fui.splitter,
					idFix:fui.getFix([self.type,'header',self.uid]),
					classFix:fui.getFix([self.type,'header'])
				});
				
				var bodyCompiled = fui.template(bodyTpl,{
					columns:this.columns
				});
				
				this.header = headerCompiled;
				this.body = bodyCompiled;
				
				// 渲染表格
				var thisTable = $('<table width="100%" border="1" cellpadding="0" cellspacing="0"></table>');
				thisTable.append(this.header.dom).append(this.body.dom);
				this.el.append(thisTable);
				this._resize();

			},
			load:function(){
				var self = this;
				$.ajax({
					url:this.url,
					type:'GET',
					dataType:'json',
					success:function(data){
						self.data = data;
						self.trigger('load');
					}
				})
				return this;
			},
			hide:function(){
				this.el.hide();
				return this;
			},
			show:function(){
				this.el.show();
				return this;
			},
			_getHeaderData:function(){
				var datas = [],
				attributes = ['field','name','title','style','sort','resize','width','headerAlign','align','visible','type','filter'],
				tagName = 'div',
				self = this;
				
				var tpl = this.source.children(tagName);
				
				

				// 递归所有节点，转换数据
				function getData(node,num){
					
					node.each(function(i){
						
						var data = {},
						
						// 获取属性
						propertys = self._getProperty($(this),attributes),

						// 获取子节点
						children = $(this).find('>'+tagName),
						
						len = children.length;
						
						// 保存属性
						fui.extend(data,propertys),
						
						data.title = data.title||$(this).text();
						
						if(len){
							// 递归子节点
							getData(children,num+1);	
							// 获取列数
							data.colspan = getCol(children);
						}else{
							// 保存行
							self.columns.push(data);
						}
						if(!datas[num]){
							datas[num] = [];
						}
						datas[num].push(data);
					});
				};
				
				function getCol(node){
					var columns = node.length;
					$(node).each(function(){
						var children = $(this).find('>'+tagName),
						len = children.length;
						if(len){
							// 排除父节点
							columns += getCol(children) - 1;
						};
					});
					return columns
				};
				
				getData(tpl,0);
				return datas;
			},
			_getProperty:function(node,propertys){
				
				var ret={};
				$(propertys).each(function(i,property){
					var attr = util(node.attr(property)).trim();
					ret[property] = attr;
				})
				return ret;
			},	
			_getHeaderTpl:function(){
				var tpl 
				= '<thead>'
				+ '{each headerData as columns i}'
				+ 	'<tr>'
				+ 	 	'{each columns as column j}'
				+  		 	'<th id="{idFix}{splitter}{i}{splitter}{j}"'
				+  		 	'{if column.colspan}'
				+  		 	 	'colspan="{column.colspan}"'
				+ 	 	 	'{else}'
				+ 	 	 	 	'rowspan="{len-i}"'
				+ 	 	 	'{/if}'
				+ 	 	 	'{if column.width}'
				+ 	 	 	 	'width="{column.width}"'
				+ 	 	 	'{/if}>'
				+ 	 	 	 	'<div class="{classFix}-outer">'
				+ 	 	 	 	 	'<div class="{classFix}-inner">{column.title}</div>'
				+ 	 	 	 	 	'{if !column.colspan}'
				+ 	 	 	 	 	'<div class="{classFix}-splitter"></div>'
				+ 	 	 	 	 	'{/if}'
				+ 	 	 	 	 '</div>'
				+ 	 	 	'</th>'
				+ 	 	'{/each}'
				+ 	'</tr>'
				+ '{/each}'
				+ '</thead>';
				return tpl;
			},
			_getBodyTpl:function(){	
				var tpl 
				= '<tbody>'
				+ '<tr>'
				+ 	'{each columns as column i}'
				+ 	'<td>{i}</td>'
				+ 	'{/each}'
				+ '</tr>'
				+'</tbody>';
				return tpl;
			},
			_creatProxy:function(data){

				var tpl 
				= '<div class="fui-proxy" style="width:{width}px;left:{left}px;top:{top}px">'
				+'    <div class="fui-proxy-border"></div>'
				+'    <div class="fui-proxy-inner"></div>'
				+'</div>';
				
				var compiled = fui.template(tpl,data);
				this.el.append(compiled.dom);
				return compiled;
			},
			_resize:function(){	
				var self = this,
				pos={
					width:0,
					pWidth:0,
					disX:0,
					left:0,
					top:0
				},
				handle,
				parent,
				proxy,
				doc = $(fui.document),
				className = fui.getFix([self.type,'header','splitter']),
				splitter = self.el.find('.'+className),
				retFalse = function(e){
					return false;
				},
				mouseDown = function(e){
					handle =  $(this);
					parent = handle.parents('th');
					var pWidth = parent.outerWidth();
					var offset = parent.offset();
					var left =offset.left;
					var top =offset.top;
					pos = {
						width:pWidth,
						pWidth:pWidth,
						disX:e.clientX,
						left:left,
						top:top
					};
					proxy = self._creatProxy(pos);
					doc.on('selectstart',retFalse);
					return false;
				},
				
				mouseMove = function(e){
					var iL = e.clientX - pos.disX;
					var iW = pos.pWidth + iL;
					iW <= 50 && (iW = 50);
					pos.width = iW;
					proxy.setData(pos);
					return false;
				},
				
				// 放开鼠标
				mouseUp=function(e){
					parent.attr('width',pos.width);
					$(proxy.dom).remove();
					
					// 销毁绑定
					doc.off('selectstart',retFalse)
					.off('mousemove',mouseMove).off('mouseup',mouseUp);
					pos={};
					handle = parent = proxy = [];
					return false;
				},
				bind = function(e){
					mouseDown.call(this,e);
					doc.on('mousemove',mouseMove).on('mouseup',mouseUp);
					return false;
				};
				
				// 绑定对象
				splitter.bind('mousedown',bind)	

				return self;	
			}
		}
	})
})();



