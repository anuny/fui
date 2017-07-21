<!doctype html>
<html lang="zh-cmn-Hans">
<head>
<meta charset="utf-8">
<title>fui</title>
<link href="fui/theme/default/css/theme.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="table" class="fui-table" url="datas/test.json" >
	<div title="1" width="100"></div>
	<div title="2"></div>
	<div title="3"></div>
	<div title="4">
		<div title="4-1">
			<div title="4-1-1">
				<div title="4-1-1-1"></div>
				<div title="4-1-1-2">
					<div title="4-1-1-2-1"></div>
					<div title="4-1-1-2-2"></div>
				</div>
			</div>
			<div title="4-1-2"></div>
		</div>
		<div title="4-2"></div>
	</div>
	<div title="5"></div>
	<div title="6">
		<div title="6-1"></div>
		<div title="6-2"></div>
		<div title="6-3"></div>
		<div title="6-4"></div>
		<div title="6-5">
			<div title="6-5-1"></div>
			<div title="6-5-2"></div>
		</div>
	</div>
	<div title="7">
		<div title="7-1"></div>
		<div title="7-2">
			<div title="7-2-1">
				<div title="7-2-1-1"></div>
				<div title="7-2-1-2"></div>
			</div>
			<div title="7-2-2"></div>
		</div>
	</div>
</div>

<div id="layout" class="fui-layout">
    <div title="north" region="top" height="80" showSplitIcon="true" >
	
        <div id="layout2" class="fui-layout">
			<div title="north" region="top" height="80" showSplitIcon="true" >
				north
			</div>
			<div title="south" region="left" split="false" splitIcon="true" header="true" height="80">
				south
			</div>
			<div title="west" region="right" width="200" expanded="false" showSplitIcon="true">
				west
			</div>
			<div title="east" region="bottom"  showCloseButton="true" showSplitIcon="true">
				east
			</div>
			<div title="east" region="container"  showCloseButton="true" showSplitIcon="true">
				east
			</div>
		</div>
		
    </div>
    <div title="south" region="left" split="false" splitIcon="true" header="true" height="80">
        south
    </div>
    <div title="west" region="right" width="200" expanded="false" showSplitIcon="true">
        west
    </div>
    <div title="east" region="bottom"  showCloseButton="true" showSplitIcon="true">
        east
    </div>
	<div title="east" region="container"  showCloseButton="true" showSplitIcon="true">
        east
    </div>
</div>

<div id="hhh" class="fui-hhh">hhh</div>
<script src="static/lib/jquery/jquery.1.9.1.min.js" type="text/javascript" ></script>
<script src="fui/fui.js" type="text/javascript" fui-lang="zh" fui-debug="false" fui-mode="default" fui-theme="default"></script>
<script>

fui(function(){

	var layout = this.get('layout');
	
	var layout2 = this.get('layout2');
	
	//var table = this.get('table');
	console.log(this.components)
	
	
	
})


</script>
</body>
</html>
