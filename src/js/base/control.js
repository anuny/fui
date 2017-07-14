(function(){
	var $ = fui.dom;

	fui.plugin({
		module : 'base.control',
		extend : 'base.component',
		method : {
			init:function(node,html){
				this.el = $(html||'<div></div>');
				this.el.addClass(this.className);
				this.el.uid = this.uid;
				this.el[0].uid = this.uid;
				this.source = node;
			},
			
			getAttrs: function(node) {
				var self = this;
				var attrs = this.attrs;
				var ret = {};
				$(attrs).each(function(i,attr){
					ret[attr] = node.attr(attr);
				});
				return ret;
			},
			canLayout: function() {
				if (this.allowLayout == false){
					 return false;
				}
				if(this.el.css('display')=='none'){
					return false
				}
				return true;
			},
			doLayout: function() {}
		}
		
	})

})(); 

(function(){
	var $ = fui.jQuery;
	fui.plugin({
		module : 'plugins.hhh',
		extend : 'base.control',
		regCls : 'hhh',
		attrs  : ['width','style','id'],
		method : {
			init:function(node){
				fui.plugins.hhh.superclass.init.call(this,node,'<div></div>');
				this.el.html('hhh')
			},
		}
	})
	
})(); 













