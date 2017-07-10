fui.jQuery(function(){
	fui.parse();
	fui.ready = true;
	fui.trigger('ready');
	
});

fui.jQuery(fui.window).on('load',function(){
	fui.layout();
	fui.load = true;
	fui.trigger('load');
});


fui.jQuery(fui.window).on('resize',function(){
	fui.trigger('resize');
});