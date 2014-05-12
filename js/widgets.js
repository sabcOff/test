CreerWidget = function(id, widType, title, data, name, period, aide){
	this.widType = widType;
	this.id = id;
	this.title = title;
	this.data = data;//[[key,value],[key,value]]
	this.display = 1;
	this.period = period;
	this.name = name;
	this.aide = aide;
	this.divContainer = function(){
		if(widType === 0){
			return "<div class='box greyBackground'; margin:0 auto;'><div id='container"+this.id+"' class='obchart' style='font-size:200%; border-radius:5px; background-color:white; text-align:center;'></div><div style='width:100%'><center><ul class='periodSelector'><li class='period' onclick='foo(event, 0);'>heure</li><li class='period' onclick='foo(event, 1);'>jour</li><li class='period selected' onclick='foo(event, 2);'>semaine</li><li class='period' onclick='foo(event, 3);'>mois</li><li class='period' onclick='foo(event, 4);'>18 mois</li></ul></center><div id='tooltip' style='display:none;'>"+this.aide+"</div> <div onclick='showHelp(this)'><i class='fa fa-question'></i></div></div></div>";
		}
		else if(widType === 4){
			return "<div class='box greyBackground'; margin:0 auto;'><div id='container"+this.id+"' class='obchart' style='font-size:200%; border-radius:5px; background-color:white; text-align:center;'></div><div style='width:100%'><div id='tooltip' style='display:none;'>"+this.aide+"</div> <div onclick='showHelp(this)'><i class='fa fa-question'></i></div></div></div>";
		}
		else{
			return "<div class='box greyBackground'><div id='container"+this.id+"' class='obchart' style='height: 400px; margin-left:50px; margin:0 auto;'></div><div style='width:100%'><center><ul class='periodSelector'><li class='period' onclick='foo(event, 0);'>heure</li><li class='period' onclick='foo(event, 1);'>jour</li><li class='period selected' onclick='foo(event, 2);'>semaine</li><li class='period' onclick='foo(event, 3);'>mois</li><li class='period' onclick='foo(event, 4);'>18 mois</li></ul></center><div id='tooltip' style='display:none;'>"+this.aide+"</div><div onclick='showHelp(this)'><i class='fa fa-question ctaHelp'></i></div></div></div>";
		}
	};
	this.visibilityToggle = function(){
		this.display = (this.display + 1)%2;
	};
	this.parse = function(){
		var string = "";
		if(this.widType === 1){
			string = {chart:{plotBackgroundColor:null,plotBorderWidth:0,plotShadow:false, width:($(window).width()*0.96)},title:{text:this.title},tooltip:{pointFormat:'{point.percentage:.1f}%'},plotOptions:{pie:{dataLabels:{enabled:true,style:{color:"black"}},startAngle:-90,endAngle:90,center:['50%','75%']}},series:[{type:'pie',name:this.name,innerSize:'50%',data:this.data}]};
			console.log(JSON.stringify(string));
		}
		else if(this.widType === 2){
			string = {chart:{type:"bar", zoomType:"none", width:($(window).width()*0.96)},title:{text:this.title},xAxis:{categories:this.data["cat"],title:{text:null}},yAxis:{min:0,title:{text:this.data['xaxis'],align:"high"},labels:{overflow:"justify"}},legend:{enabled:false,layout:"vertical",align:"right",verticalAlign:"top",x:-40,y:100,floating:true,borderWidth:1,backgroundColor:"#FFFFFF",shadow:true},tooltip:{},plotOptions:{bar:{dataLabels:{enabled:true}}},credits:{enabled:false},series:this.data["serie"]};
		}
		else if(this.widType === 3){
			string = {chart:{type:"area", width:($(window).width()*0.96)},title:{text:this.title},xAxis:{categories: this.data['cat']},yAxis:{title:{text:"Valeur"}},tooltip:{pointFormat:"Chiffre d'affaire: <b>{point.y:,.0f}</b>"},legend:{enabled:false},credit:{disabled:true},series:[{name:"USA",data:this.data["ca"]}]};
		}
		else if(this.widType === 0){
			string = "";
		}
		else if(this.widType === 4){
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
	strOneByOne = '{"widgets":[';
	$.ajax({
	  dataType: "json",
	  url: "https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/api/ids",
	  success: function(data){
	  	var ht = "";
	  	var nbWidgets = (data.ids).length;
	  	var i = 0;
	  	data.ids.forEach(function(entry){
	  		ht = ht + "<div id='"+entry+"' class='preWid'></div>";
			i = i + 1;
			if(i == 12){
				$("#dash").append(ht);
				fillPreWid();
			}
		});
	  },
	});/*
	$.ajax( {
		url:"https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/getStat/",
		beforeSend: function(xhr){xhr.setRequestHeader('Origin', '*');},
		method:"post", 
		data:{'contrat': storage.getItem("contrat"), 'uuid' : uuid, 'config' : storage.getItem("widgetsConfig")},
		dataType:'json',
		statusCode: {
			200 : function(data){
				//casting to JSON and save it in the local storage
				if(storage.getItem("widgetsConfig") == undefined){
					storage.setItem("widgetsConfig", JSON.stringify(data.widgets));
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
	});*/
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
				var lang = parseInt(storage.getItem("lang"));
				console.log("lang = "+lang);
				var widgetC = null;
				switch(lang){
					case 0:widgetC = CreerWidget(entry.id, entry.widType, entry.titleuk, entry.data, entry.name, entry.period, entry.aideuk);break;
					case 1:widgetC = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name, entry.period, entry.aide);break;
					case 2:widgetC = CreerWidget(entry.id, entry.widType, entry.titlenl, entry.data, entry.name, entry.period, entry.aidenl);break;
					default:widgetC = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name, entry.period, entry.aide);break;
				}
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
					else if(entry.widType === 4){
						$("#container"+entry.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+entry.title+"</span><br /><span style='font-size:50%;'>"+entry.data['list']+"</span>");
					}
					else{
						$("#container"+entry.id).highcharts(entry.parse());
					}
					myScroll.refresh();
					setTimeout(function(){$(".menuDash").fadeIn();}, 100);
				});
			});
		});
	}, 500);
}

function foo(event, periode){
	var divperiodSel = $(event.target).parent();
	$(divperiodSel).find(".period").removeClass("selected");
	$(event.target).addClass("selected");
	var container = $(event.target).parent().parent().parent().parent().find(".obchart");
	if (container == null){
		container = $(event.taget).parent().find(".obchart");
	}
	var position = $(container).parent();
	var id = $(container).attr("id").split("container")[1];
	console.log(id);
	console.log(position);
	$(container).fadeOut("fast", function(){
		container.html('<div class="spinner"></div>');
		$(container).fadeIn("fast");
		$.ajax( {
			url:"https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/widget/"+id+"/"+periode, 
			method:"post", 
			data:{'contrat': storage.getItem("contrat"), 'uuid' : uuid, 'config' : storage.getItem("widgetsConfig")},
			dataType:'json',
			statusCode: {
				200:function(data){
					var json = JSON.stringify(data.widgets);
					var widgetMaj = null;
					var entry = JSON.parse(json)[0];
					console.log("new json = "+json+" ooooo "+entry);
					widgetMAJ = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name, entry.period, entry.aide);
					//$(widgetMAJ.divContainer()).find(".obchart").hide();
					//$(position).html($(widgetMAJ.divContainer()).find(".obchart"));
					$(container).slideDown(function(){
						if(widgetMAJ.widType === 0){
							if(widgetMAJ.data['delta'] < 0){
								$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><p style='font-size:200%;'>"+widgetMAJ.data['nbVente']+"<i class='fa fa-angle-double-down' style='margin-left:5px; color:red; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> ("+widgetMAJ.data["delta"]+")</span></p>");
							}
							else{
								$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><p style='font-size:200%;'>"+widgetMAJ.data['nbVente']+"<i class='fa fa-angle-double-up' style='margin-left:5px; color:green; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> (+"+widgetMAJ.data["delta"]+")</span></p>");
							}
						}
						else if(widgetMAJ.widType === 4){
							$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><span style='font-size:50%;'>"+widgetMAJ.data['list']+"</span>");
						}
						else{
							$("#container"+widgetMAJ.id).highcharts(widgetMAJ.parse());
						}
					myScroll.refresh();

					});
				}
			}
		});
	});
}
function fillPreWid(){
	var i = 0;
	var nbWidget = $(".preWid").length;
	console.log(nbWidget);
	$(".preWid").each(function(index){
		i = i +1;
		var that = this;
		var id = $(this).attr('id');
		//		console.log($(this).attr('id'));
		$.ajax( {
			url:"https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/widget/"+id+"/2", 
			method:"post", 
			data:{'contrat': storage.getItem("contrat"), 'uuid' : uuid, 'config' : storage.getItem("widgetsConfig")},
			dataType:'json',
			statusCode: {
				200:function(data){
					var json = JSON.stringify(data.widgets);
					var widgetMaj = null;
					var entry = JSON.parse(json)[0];
					console.log("new json = "+json+" ooooo "+entry);
					widgetMAJ = CreerWidget(entry.id, entry.widType, entry.title, entry.data, entry.name, entry.period, entry.aide);
					$(that).append(widgetMAJ.divContainer());
					//$(widgetMAJ.divContainer()).find(".obchart").hide();
					//$(position).html($(widgetMAJ.divContainer()).find(".obchart"));
					if(widgetMAJ.widType === 0){
						if(widgetMAJ.data['delta'] < 0){
							$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><p style='font-size:200%;'>"+widgetMAJ.data['nbVente']+"<i class='fa fa-angle-double-down' style='margin-left:5px; color:red; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> ("+widgetMAJ.data["delta"]+")</span></p>");
						}
						else{
							$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><p style='font-size:200%;'>"+widgetMAJ.data['nbVente']+"<i class='fa fa-angle-double-up' style='margin-left:5px; color:green; margin-right:15px; font-size:70%;'></i><span style='font-size:30%'> (+"+widgetMAJ.data["delta"]+")</span></p>");
						}
					}
					else if(widgetMAJ.widType === 4){
						$("#container"+widgetMAJ.id).html("<span style='color:#274B6D; font-size:70%; font-weight:500;'>"+widgetMAJ.title+"</span><br /><span style='font-size:50%;'>"+widgetMAJ.data['list']+"</span>");
					}
					else{
						$("#container"+widgetMAJ.id).highcharts(widgetMAJ.parse());
					}
					if(i == nbWidget){
						$(".spinner").fadeOut("fast", function(){
							$(".spinner").remove();
							$("#dash").fadeIn();
						});
						myScroll.refresh();
						setTimeout(function(){$(".menuDash").fadeIn();}, 100);
					}
				}
			}
		});
	});
}