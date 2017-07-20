fui.define('core/event',function( module ){

	'use strict';
	
	var util = fui.util;
	
	var handers = {};
	
	var on = function(event,hander){
		if(!handers[event]) handers[event] = [];
		[].push.apply(handers[event], [hander]);
		return this;
	}
	
	var trigger = function(event){
		
		var self = this;
		if(handers[event]){
			$(handers[event]).each(function(i,hander){	
				hander && util(this).is('function') && this.call(self);
			});
		}
		return this;
	}
	
	module.exports = {on:on, trigger:trigger};	
});
fui.extend(fui.require('core/event'));


