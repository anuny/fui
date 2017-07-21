fui.define('template',function( module ){
	var artTemplate = fui.require('template/artTemplate');
	var vTemplate = fui.require('template/vTemplate');
	
	var template = function(source,data) {
		return new template.fn.init(source,data);
	};
	
	template.fn = template.prototype = {
		constructor: template,
		init:function(source,data) {
			var compiled = function(){
				var compiler = artTemplate.compile(source);
				return vTemplate(compiler, data);
			};
			compiled = compiled();
			this.dom = compiled.dom;
			this.setData = function(data,callback){
				compiled.setData(data,callback);
				return this;
			}
			return this;
		}
	}
	template.config = function(options){
		for(var i in options){
			artTemplate.config(i,options[i])
		}
	}
	template.fn.init.prototype = template.fn;
	module.exports = template;
});

fui.extend({template:fui.require('template')});