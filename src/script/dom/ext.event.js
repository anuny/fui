!function(fui,util,$){
	var sizzle = fui.require('dom/sizzle');
	var msie = util.browser.msie;
	var styleFloat = msie ?"styleFloat" :"cssFloat";
	var doc = fui.document;
	$.extend({
		addEventListener: function(eventType, funcHandle, useCapture) {
			var element = this, eventStoreType = '';
			if (eventType == "input") {
				eventType = "propertychange";
			}
			if (typeof funcHandle != "function"){
				return;
			}
			// some compatibility deal
			var eventHandle = function(event) {
				event = event || window.event || {};
				
				if (!event.target) {
					event.target = event.srcElement;	
				}
				if (!event.preventDefault) {
					event.preventDefault = function() {
						event.returnValue = false;
					};
				}
				
				if (eventType == "propertychange") {
					if (event.propertyName !== "value" || element.r_oldvalue === element.value){
						 return;
					}
					element.r_oldvalue = element.value;
				} 
				return funcHandle.call(element, event || {});
			};
			eventHandle.initFuncHandle = funcHandle;
			
			// event bind
			element.attachEvent("on" + eventType, eventHandle);
			
			// event store
			if (element["event" + eventType]) {
				element["event" + eventType].push(eventHandle);
			} else {
				element["event" + eventType] = [eventHandle];
			}			
		},
		dispatchEvent: function(event) {
			var eventType = event && event.type;			
			if (eventType && this["event" + eventType]) {
				event.target = this;
				this["event" + eventType].forEach(function(eventHandle) {
					event.timeStamp = Date.now();
					eventHandle.call(this, event);
				}.bind(this));
			}			
		},
		removeEventListener: function(eventType, funcHandle, useCapture) {			
			var arrEventStore = this["event" + eventType];
			if (Array.isArray(arrEventStore)) {
				this["event" + eventType] = arrEventStore.filter(function(eventHandle) {
					if (eventHandle.initFuncHandle === funcHandle) {
						this.detachEvent("on" + eventType, eventHandle);
						return false;
					}					
					return true;
				}.bind(this));
			}	
		}
	});
}(fui,fui.util,fui.dom);


