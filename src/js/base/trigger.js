!function(){
	var $ = fui.dom;
	$(function(){
		fui.parse();
		fui.ready = true;
		fui.trigger('ready');
	});

	$(fui.window).on('load',function(){
		fui.layout();
		fui.load = true;
		fui.trigger('load');
	});


	$(fui.window).on('resize',function(){
		fui.trigger('resize');
	});
}()
	
	
