var fui={
	base:{},
	plugin:{},
	extend:$.extend
}

var getModule = function(option){
	var module = option.split('.');
	var moduleType = module[0];
	var moduleName = module[1];
	return {module:option,type:moduleType,name:moduleName};
}

fui.reg = function(option){

	var init = function (){
		this.supperClass.constructor.call(this);
	};

	var module = getModule(option.module);
	
	fui[module.type][module.name] = option.init || init;
	
	var _this = fui[module.type][module.name];
	
	var thisPrototype = _this.prototype;

	if(option.mothed){
		fui.extend(thisPrototype,option.mothed);
	}
	
	if(option.extend){
		var extend = getModule(option.extend);
		var extendPrototype = fui[extend.type][extend.name].prototype;
		fui.extend(thisPrototype,extendPrototype,option.mothed,{supperClass:extendPrototype});
	};
	fui.extend(thisPrototype,{module:option.module});
	return _this;
}

fui.reg({
	module:'base.ctrl',
	init:function(){
		this.uid = 123;
	},
	mothed:{
		isCtrl : true,
		name:'base',
		sss:1,
		test:function(){
			return this.sss
		}
	}
});

var test = fui.reg({
	module:'plugin.test',
	extend:'base.ctrl',
	mothed:{
		name:'test',
		sss:2,
		test:function(){
			return this.supperClass.test.call(this)
		}
	}
});

console.log(new test())

//constructor