(function(){
	var $ = fui.jQuery;
	fui.plugin('layout','control',function(){
		this.className = 'fui-layout';
		this.extAttrs = ["minWidth","minHeight","maxWidth","maxHeight","split","region"];
		return this;
	}).extend({
		test:function(){
			console.log(this.el);
			return this;
		}
	});
})();