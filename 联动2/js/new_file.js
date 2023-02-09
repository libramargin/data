require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/core/watchUtils", 
	"esri/layers/FeatureLayer",
	"esri/layers/TileLayer",
	"esri/geometry/support/webMercatorUtils",
	'dojo/dom-style',
	"esri/config"
  ], function(Map, SceneView, MapView, Graphic, watchUtils, FeatureLayer, TileLayer, webMercatorUtils, EsriDomStyle, esriConfig) {
	
	esriConfig.apiKey = "AAPKbbaeb3bef38c4bb2b456d86bc4bc808cLcCDYXzn16c8g6_dAYQhkDOSnvw1-teyLhEWBJ8828_Fz6tsW96ElcS0JcixRuA6";
    
	//创建一个作为2D主视图
	var map2d = new Map({
		basemap: "oceans"//topo-vector,satellite,oceans,osm,gray-vector,dark-gray-vector,streets-vector
	});
	
	var view = new MapView({
		map: map2d,
		center:[112, 35.027],
		zoom: 5,
		container: "viewDiv2"
	});
	
	//地震图层
	var Earthquakes = new FeatureLayer({
		url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer",
		id: "earthquakes",
		visible: false
	});
	//街道图层
	var transportationLayer = new TileLayer({
	          url: "https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer",
	          // This property can be used to uniquely identify the layer
	          id: "streets",
	          visible: false
	        });
	map2d.add(Earthquakes);
	map2d.add(transportationLayer);
	view.ui.components = [];
	
	//专题地图选择
	const streetsLayerToggle = document.getElementById("streetLayer");
	streetsLayerToggle.addEventListener("change", () => {
		transportationLayer.visible = streetsLayerToggle.checked;
	});
	const earthquakeLayerToggle = document.getElementById("earthquakeLayer");
	earthquakeLayerToggle.addEventListener("change", () => {
		Earthquakes.visible = earthquakeLayerToggle.checked;
	});
	//底图选择
	const darkToggle = document.getElementById("dark-gray-vector");
	darkToggle.addEventListener("change", () => {
		map2d.basemap = "dark-gray-vector";
	});
	const streetsToggle = document.getElementById("streets-vector");
	streetsToggle.addEventListener("change", () => {
		map2d.basemap = "streets-vector";
	});
	const topoToggle = document.getElementById("topo-vector");
	topoToggle.addEventListener("change", () => {
		map2d.basemap = "topo-vector";
	});
	const satelliteToggle = document.getElementById("satellite");
	satelliteToggle.addEventListener("change", () => {
		map2d.basemap = "satellite";
	});
	const oceansToggle = document.getElementById("oceans");
	oceansToggle.addEventListener("change", () => {
		map2d.basemap = "oceans";
	});
	const osmToggle = document.getElementById("osm");
	osmToggle.addEventListener("change", () => {
		map2d.basemap = "osm";
	});
	
	// 创建一个地图3D主视图
    var mainMap = new Map({
      basemap: "hybrid",
    });
	// 建立一个三维视图显示3D Map实例
	var mainView = new SceneView({
	  container: "viewDiv",  //将三维地图放进对应div中
	  map: mainMap,
	  center:[112, 35.027],
	  zoom: 5
	});
	mainView.ui.components = [];
	//创建一个卷帘图层
	var esriContainerDiv = 'viewDiv';
	var esriSwipeContainerDiv = 'map3';
	var map3 = new Map({
		basemap: "osm"
	});
	var view3 = new SceneView({
		container: "map3",  //将三维地图放进对应div中
		map: map3,
		center:[112, 35.027],
		zoom: 5
	});
	view3.ui.components = [];
	
	// 窗口联动1
	// view.on(["pointer-down", "pointer-move"], function() {
	// 		mainView.center = view.center;
	// 	});
	// mainView.on(["pointer-down", "pointer-move"], function() {
	// 	view.center=mainView.center;
	// });
	// view.watch("stationary", function(){
	// 	mainView.viewpoint = view.viewpoint;
	// });
	// mainView.watch("stationary", function(){
	// 	view.viewpoint = mainView.viewpoint;
	// });
	
	// 窗口联动方法2
	const views = [view, mainView, view3];
	let active;
	const sync = (source) => {
	    if (!active || !active.viewpoint || active !== source) {
	        return;
			}
	
	    for (const view of views) {
	        if (view !== active) {
	            view.viewpoint = active.viewpoint;
	            }
	        }
		};
	for (const view of views) {
		view.watch(["interacting", "animation"], () => {
			active = view;
			sync(active);
		});
		view.watch("viewpoint", () => sync(view));
	}
	
	//显示坐标
	view.on("pointer-move", function(evt){
		var coord = view.toMap({x: evt.x, y: evt.y});
		document.getElementById("coordinate2").innerHTML = "lng/lat:" + coord.longitude.toFixed(2) + "," + coord.latitude.toFixed(2);
	});
	// mainView.on("pointer-move", function(event){
	// 	var coord1 = view.toMap({x: event.x, y: event.y});
	// 	document.getElementById("coordinate1").innerHTML = "lng/lat:" + coord1.longitude.toFixed(2) + "," + coord1.latitude.toFixed(2);
	// });
	
	//比例尺
	view.watch("extent", function(evt){
		document.getElementById("scalebar").innerHTML = "scale：1:" + Math.round(view.scale);
	});
	
	//显示图层数量
	const layerToggle2 = document.getElementById("layerToggle2");
	layerToggle2.addEventListener("click", () => {
		var inputs = document.getElementsByName("box");
		//循环给input绑定点击事件
		var total = 0;
		for (var j=0;j<inputs.length;j++){
			if(eval("inputs[" + j + "].checked") == true){
				total = total+1;
			}	
		}
		document.getElementById("count").innerHTML = "(共显示" + total + "个图层)";
	});
	
	//删除图层
	deleteearthlayer.addEventListener("click", () => {
		document.getElementById("dizhen").innerHTML = "";
	});
	deletestreetlayer.addEventListener("click", () => {
		document.getElementById("jiedao").innerHTML = "";
	});
	
	//分割线移动状态
	var isSlitLineDragging = false;
	document.getElementById("vertical_line").onmousedown = function() {
		isSlitLineDragging = true;
	};
	document.getElementById("vertical_line").onmouseup = function() {
		isSlitLineDragging = false;
	};
	//分割线移动事件param {Object} e 分割线移动事件对象
	function pointMove(e) {
		e.stopPropagation();
		updateMapSwipeLocation(e.x)
	};
	//更新卷帘地图容器展开位置@param {Number} location 当前的位置, @param {Boolean} isInit 是否是初始化
	function updateMapSwipeLocation(location, isInit) {
		const swipeMap = document.getElementById(esriSwipeContainerDiv).getBoundingClientRect();
		const offsetX = location;
		if (isSlitLineDragging || isInit) {
			EsriDomStyle.set(esriSwipeContainerDiv, "z-index", "1");
			EsriDomStyle.set(esriSwipeContainerDiv, 'clip', 'rect(0px,' + offsetX + 'px, ' + swipeMap.height + 'px,0px)');
			EsriDomStyle.set('vertical_line', 'left', (offsetX - 20 + (swipeMap.width * 0.024)) + 'px ');
		}
	};
	//同步两个视图容器入口函数
	function synchronizeViews(views) {
		let handles = views.map(function(view, idx, views) {
			const others = views.concat();
			others.splice(idx, 1);
			return synchronizeViews(view, others);
		});
		return {
			remove: function() {
				this.remove = function() {}
				handles.forEach(function(h) {
					h.remove();
				});
				handles = null;
			}
		}
	}
	mainView.on("pointer-move", (e) => {
		pointMove(e);
		var coord1 = view.toMap({x: event.x, y: event.y});
		document.getElementById("coordinate1").innerHTML = "lng/lat:" + coord1.longitude.toFixed(2) + "," + coord1.latitude.toFixed(2);
	});
	view3.on("pointer-move", (e) => {
		pointMove(e);
		var coord1 = view.toMap({x: event.x, y: event.y});
		document.getElementById("coordinate1").innerHTML = "lng/lat:" + coord1.longitude.toFixed(2) + "," + coord1.latitude.toFixed(2);
	});
	//设置初始位置
	const swipeMap = document.getElementById(esriSwipeContainerDiv).getBoundingClientRect();
	updateMapSwipeLocation(swipeMap.width * 0.5, true);
	
  });
