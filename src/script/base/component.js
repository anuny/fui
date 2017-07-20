!function(){
	var $ = fui.dom;
	
	fui.base.component = function() {
		this.uid = fui.creatUid();

		if (!this.id){
			this.id = this.uid;
		}
		fui.reg(this);
		return this;
	};

	fui.base.component.prototype = {
		isControl: true,

		set: function(attrs) {
			
			if (typeof attrs == "string") {
				return this;
			}
			
			for (var key in attrs) {
				var attr = attrs[key], 
				action= "set" + key.charAt(0).toUpperCase() + key.substring(1, key.length), 
				thisAction = this[action];
				
				if (thisAction) {
					
					thisAction.call(this, attr)
				}else {
					this[key] = attr;
				}
			}
			
			if (this.doLayout){
				this.doLayout();
			}
			return this;
		},
		setId: function(id) {
			fui.unreg(this);
			this.id = id;
			this.el.id = id;
			this.el.attr('id',id);
			fui.reg(this);
		},
		setWidth: function(value) {
			this.width = value;
			this.el.width(value);
		},
		setHeight: function(value) {
			this.height = value;
			this.el.height(value);
		},
		setStyle: function(value) {
			this.style = value;
			value && this.el.css(value);
		},
		setClass: function(value) {
			this.el.removeClass(this.cls).addClass(value);
			this.cls = value;
		},
		on:function(event,hander){
			event = event+'::'+this.uid
			fui.on(event,hander);
			return this;
		},
		trigger:function(event){
			event = event+'::'+this.uid
			fui.trigger.call(this,event);
			return this;
		}
	};
}();



