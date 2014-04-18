CreerWidget = function(id, widType, title, data, name, period){
	this.widType = widType;
	this.id = id;
	this.title = title;
	this.data = data;//[[key,value],[key,value]]
	this.display = 1;
	this.period = period;
	this.name = name;
	this.divContainer = function(){
		if(widType === 0){
			return "<div class='box greyBackground' style='min-width: 310px; margin-left:50px; margin:0 auto;'><div id='container"+this.id+"' style='font-size:200%; border-radius:5px; background-color:white; text-align:center;'></div></div>";
		}
		else{
			return "<div class='box greyBackground'><div id='container"+this.id+"' class='obchart' style='min-width: 310px; height: 400px; margin-left:50px; margin:0 auto;'></div><div style='width:100%'><center><ul class='periodSelector'><li class='period selected'>jour</li><li class='period'>semaine</li></ul></center></div></div>";
		}
	};
	this.visibilityToggle = function(){
		this.display = (this.display + 1)%2;
	};
	this.parse = function(){
		var string = "";
		if(this.widType === 1){
		this.title = this.title+ " - " +this.period;
			string = {chart:{plotBackgroundColor:null,plotBorderWidth:0,plotShadow:false},title:{text:this.title},tooltip:{pointFormat:'{point.percentage:.1f}%'},plotOptions:{pie:{dataLabels:{enabled:true,style:{color:"black"}},startAngle:-90,endAngle:90,center:['50%','75%']}},series:[{type:'pie',name:this.name,innerSize:'50%',data:this.data}]};
			console.log(JSON.stringify(string));
		}
		else if(this.widType === 2){
			string = {chart:{type:"bar", zoomType:"none"},exporting:{enabled:false},title:{text:this.title},xAxis:{categories:this.data["cat"],title:{text:null}},yAxis:{min:0,title:{text:this.data['xaxis'],align:"high"},labels:{overflow:"justify"}},legend:{enabled:false,layout:"vertical",align:"right",verticalAlign:"top",x:-40,y:100,floating:true,borderWidth:1,backgroundColor:"#FFFFFF",shadow:true},tooltip:{},plotOptions:{bar:{dataLabels:{enabled:true}}},credits:{enabled:false},series:this.data["serie"]};
		}
		else if(this.widType === 3){
			string = {chart:{type:"area"},title:{text:this.title},xAxis:{categories: this.data['cat']},yAxis:{title:{text:"Valeur"}},tooltip:{pointFormat:"Chiffre d'affaire: <b>{point.y:,.0f}</b>"},legend:{enabled:false},credit:{disabled:true},series:[{name:"USA",data:this.data["ca"]}]};
		}
		else if(this.widType === 0){
			string = "";
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
	$.ajax( {
		url:"https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/getStat/", 
		method:"post", 
		data:{'contrat': storage.getItem("contrat"), 'uuid' : uuid, 'config' : storage.getItem("widgetsConfig")},
		dataType:'json',
		statusCode: {
			200 : function(data){
				//casting to JSON and save it in the local storage
				if(storage.getItem("widgetsConfig") == null){
					storage.setItem("widgetsConfig", JSON.stringify(data.widgets));
				}
				else{
					console.log(data);
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
				buildCharts();
			},
			400:function(data){
				alert("Votre appareil n'a pas été reconnu. Reconfigurez vos accès ou contactez Sabco");
			},
			404: function(data){
				alert("Vos accès ne correspondent pas. Reconfigurez-les ou contactez Sabco");
			}
		}
	});
	
};

/*
 *
 */
function buildCharts(){
	widgets = new Array();
	$("#dash").html("");
	//building and displaying widgets
	var fromStorage = JSON.parse(storage.getItem("widgetsConfig"));
	setTimeout(function(){
		fromStorage.forEach(function(entry){
			if(entry.visible === "on"){
				var widgetC = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name, entry.period);
				$("#dash").append(widgetC.divContainer());
				widgets.push($.extend({}, widgetC));
			}
		});
		$(".spinner").fadeOut("slow", function(){
			widgets.forEach(function(entry){
				$("#dash").fadeIn("fast", function(){
					if(entry.widType === 0){
						if(entry.data['delta'] < 0){
							$("#container"+entry.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+entry.title+"</span><br /><p style='font-size:200%;'>"+entry.data['nbVente']+"<i class='fa fa-angle-double-down' style='margin-left:5px; color:red; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> ("+entry.data["delta"]+")</span></p>");
						}
						else{
							$("#container"+entry.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+entry.title+"</span><br /><p style='font-size:200%;'>"+entry.data['nbVente']+"<i class='fa fa-angle-double-up' style='margin-left:5px; color:green; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> (+"+entry.data["delta"]+")</span></p>");
						}
					}
					else{
						$("#container"+entry.id).highcharts(entry.parse());
					}
					myScroll.refresh();
				});
			});
		});
	}, 500);
}