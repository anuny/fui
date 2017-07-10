<!doctype html>
<html lang="zh-cmn-Hans">
<head>
<meta charset="utf-8">
<title>fui</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<script src="static/lib/jquery/jquery.1.9.1.min.js" type="text/javascript"></script>
<script src="fui/fui.bundle.js" type="text/javascript" fui-lang="zh" fui-debug="true" fui-mode="default" fui-theme="default"></script>
</head>
<body>


<script id="user" type="text/template">
  <h1>{title + ' - ' + description}</h1>
  <ul>
    {each list}
      {if $value.sub}
			<li class="has-sub">
				<div class="phua-menubar-target" data-href="javascript:;" id="phua-nav-{$value.id}">
					{if $value.icon}<i class="phua-menu-icon {$value.icon}"></i>{/if}
					<span class="phua-menu-title">{$value.name}</span><span class="phua-menu-arrow"></span>
				</div>
				<ul class="phua-menu-sub">
					{each $value.sub}
					<li>
						<div class="phua-menubar-target" data-href="{$value.url}" id="phua-nav-{$value.id}">
							{if $value.icon}<i class="phua-menu-icon {$value.icon}"></i>{/if}
							<span class="phua-menu-title">{$value.name}</span>
						</div>
					</li>
					{/each}
				</ul>
			</li>
		{else}
			<li>
				<div class="phua-menubar-target" data-href="{$value.url}" id="phua-nav-{$value.id}">
					<i class="phua-menu-icon {$value.icon||'fa-file'}"></i>
					<span class="phua-menu-title">{$value.name}</span>
				</div>
			</li>
		{/if}
    {/each}
  </ul>
</script>

<script>


$(document).on('click','.phua-menubar-target',function(){
	var text = $(this).text();
	text = fui.util(text).trim()
	console.log(text)
})

var userTpl = document.getElementById('user').innerHTML;

var data = {
	title:'Tree',
	description:'Test',
	list : [
		{
			"id":1,
			"name" : "一级",
			"icon" : "fa-table",
				"sub" : [ {
					"id":11,
					"name" : "二级"
				}, {
					"id":12,
					"name" : "二级",
					"icon" : "fa-table"
				} ]
		},
		{
			"id":2,
			"name" : "一级",
			"url" : "http://www.baidu.com"
		}
	]
};

var user = fui.template(userTpl, data);
document.body.appendChild(user.dom);


// 一秒以后改变数据，DOM会跟着改变
data.description = 'Demo'
data.list[1].name = '三级'

data.list.push({
	"id":3,
	"name" : "三级",
	"url" : "http://www.baidu.com"
})

setTimeout(function () {
  user.setData(data)
}, 1000)


fui.panel({
	title:'<span class="icon-test"></span><span class="fui-dialog-title-text">FUI PANNEL</span>',
	content:'<span style="color:#F00">hello world!</span>',
	width: 500,
	resize: true,
	proxy:true,
	closeBtn:true,
	scaleBtn:true,
	buttons:{
		header:[
			{
				name:'close',
				title:'关闭',
				icon:'icon-close'
			}
		],
		footer:[
			{
				name:'close',
				title:'关闭',
				icon:'icon-close'
			}
		]
	},
	callback:function(action){

	}
});



fui.window({
	title:'<span class="icon-test"></span><span class="fui-dialog-title-text">FUI WINDOW</span>',
	content:'<span style="color:#F00">hello world!</span>',
	width:500,
	x:'center',
	y:'center',
	resize: true,
	move: true,
	proxy:true,
	closeBtn:true,
	scaleBtn:true,
	buttons:{
		header:[
			{
				name:'close',
				title:'关闭',
				icon:'icon-close'
			}
		],
		footer:[
			{
				name:'close',
				title:'关闭',
				icon:'icon-close'
			}
		]
	},
	callback:function(action){

	}
});

</script>
</body>
</html>
