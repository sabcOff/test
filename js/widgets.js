CreerWidget = function(id, widType, title, data, name){
	this.widType = widType;
	this.id = id;
	this.title = title;
	this.data = data;//[[key,value],[key,value]]
	this.display = 1;
	this.name = name;
	this.divContainer = "<div class='box greyBackground'><div id='container"+this.id+"' class='obchart' style='min-width: 310px; height: 400px; margin-left:50px; margin:0 auto;'></div></div>";
	this.visibilityToogle = function(){
		this.display = (this.display + 1)%2;
	};
	this.parse = function(){
		var string = "";
		if(this.widType === 1){
			string = {chart:{plotBackgroundColor:null,plotBorderWidth:0,plotShadow:false},title:{text:this.title},tooltip:{pointFormat:'{point.percentage:.1f}%'},plotOptions:{pie:{dataLabels:{enabled:true,style:{color:"black"}},startAngle:-90,endAngle:90,center:['50%','75%']}},series:[{type:'pie',name:this.name,innerSize:'50%',data:this.data}]};
		}
		else if(this.widType === 2){
			string = {chart:{type:"bar", zoomType:"none"},exporting:{enabled:true},title:{text:this.title},xAxis:{categories:this.data["cat"],title:{text:null}},yAxis:{min:0,title:{text:this.data['xaxis'],align:"high"},labels:{overflow:"justify"}},legend:{enabled:false,layout:"vertical",align:"right",verticalAlign:"top",x:-40,y:100,floating:true,borderWidth:1,backgroundColor:"#FFFFFF",shadow:true},tooltip:{},plotOptions:{bar:{dataLabels:{enabled:true}}},credits:{enabled:false},series:this.data["serie"]};
		}
		return string;
	};
	return this;
};

/*
 * Initialisation
 * grab data from API save it and parse it into widgets
 */
function initialisation(){
	//Getting the widgets' string from the server
	$.getJSON("https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/getWidgets/", function(data){
		
		//casting to JSON and save it in the local storage
		if(storage.getItem("widgetsConfig") == null){
			storage.setItem("widgetsConfig", JSON.stringify(data.widgets));
		}
		else{
			var current = JSON.parse(storage.getItem("widgetsConfig"));
			var newStr = data.widgets;
			var currentId = new Array();
			current.forEach(function(entry){
				if(entry.visible === "off"){
					currentId.push(entry.id);	
				}
			});
			newStr.forEach(function(entry){
				if($.inArray(entry.id, currentId) != -1){
					entry.visible = 'off';
				}
			});
			storage.setItem("widgetsConfig", JSON.stringify(newStr));
			console.log(storage.getItem("widgetsConfig"));
		}
	});
	
};

/*
 *
 */
function buildCharts(){
	//building and displaying widgets
	var fromStorage = JSON.parse(storage.getItem("widgetsConfig"));
	fromStorage.forEach(function(entry){
		if(entry.visible === "on"){
			widgetC = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name);
			$("#dash").append(widgetC.divContainer);
			console.log(widgetC.parse());
			$("#container"+widgetC.id).highcharts(widgetC.parse());
		}
	});	
}