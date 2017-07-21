(function(){
	var $ = fui.jQuery;
	fui.plugin({
		module : 'plugins.layout',
		extend : 'base.control',
		regCls : 'layout',
		attrs  : ['width','style','id','title','region'],
		method : {
			init: function(node) {
				this.superclass.init.call(this,node,'<div><div class="mini-layout-border"></div></div>');
				this.border = this.el.children().first();
				this._render();
			},
			_render:function(){
				console.log(this.border)
				this.border.append(this.id)
				
				//fui.parse(this.source);
				
				//console.log(this.el)
				
			},
			doLayout:function(){
				//console.log(this.type,this.id)
			},
			doUpdate:function(){
				
			},
			setRegion:function(a){
				//console.log(a)
			}
		}
	})
})(); 