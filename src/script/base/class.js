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

	var constructor = function (){
		fui[module.type][module.name].superclass.constructor.call(this);
	};

	var module = getModule(option.module);
	
	fui[module.type][module.name] = option.constructor || constructor;
	
	var newClass = fui[module.type][module.name];
	
	var thisPrototype = newClass.prototype;

	if(option.extend){
		var extend = getModule(option.extend);
		var extendClass = fui[extend.type][extend.name];
		var extendPrototype = extendClass.prototype;
		fui.extend(thisPrototype,extendPrototype);
		
		thisPrototype.superclass = extendPrototype;
		thisPrototype.superclass.constructor = extendClass;
	};
	
	
	if(option.prototype){
		fui.extend(thisPrototype,option.prototype);
	}
	
	fui.extend(thisPrototype,{module:option.module});
	return newClass;
}

fui.reg({
	module:'base.ctrl',
	constructor:function(){
		this.uid = 123;
	},
	prototype:{
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
	constructor:function(){
		fui.plugin.test.superclass.constructor.call(this);
		this.uid = this.uid +1
	},
	prototype:{
		name:'test',
		sss:2,
		test:function(){
			return this.superclass.test.call(this)
		}
	}
});

var demo = fui.reg({
	module:'plugin.demo',
	extend:'plugin.test',
	constructor:function(){
		console.log(fui.plugin.demo.superclass)
		fui.plugin.demo.superclass.constructor.call(this);
	},
	prototype:{
		name:'demo',
		sss:5,
		test:function(){
			return this.superclass.test.call(this)
		}
	}
});

console.log(new demo())

//constructor