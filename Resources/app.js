// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title: 'Ski Bus Map',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    title:'Map',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'Skibus stops and routes',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

var annotations = [
		Ti.Map.createAnnotation({
			latitude: 62.545376,
			longitude: 12.544772,
			title: 'Funäsdalens busstation',
			animate: true,
			pincolor: Ti.Map.ANNOTATION_GREEN
		}),
		Ti.Map.createAnnotation({
			latitude: 62.637074,
			longitude: 12.444334,
			title: 'Bruksvallarna',
			animate: true,
			pincolor: Ti.Map.ANNOTATION_GREEN
		}),
		Ti.Map.createAnnotation({
			latitude: 62.700897,
			longitude: 12.388619,
			title: 'Ramundberget',
			animate: true,
			pincolor: Ti.Map.ANNOTATION_GREEN
		})
];

var mapView = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	region: {latitude: 62.545376, longitude: 12.544772, latitudeDelta: .1, longitudeDelta: .1},
	animate: true,
	regionFit: true,
	userLocation: false,
	annotations: annotations
});


win1.add(mapView);
//win1.add(label1);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Time Table',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    title:'TimeTable',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'Time Table for the Ski bus',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);

//
// create controls tab and root window
//
var taxiWindow = Titanium.UI.createWindow({  
    title:'Taxi',
    backgroundColor:'#fff'
});
var taxi = Titanium.UI.createTab({  
    title: 'Taxi',
    window:taxiWindow
});

var taxiLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'Taxi information',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

taxiWindow.add(taxiLabel);

//
// create controls tab and root window
//
var carpoolWindow = Titanium.UI.createWindow({  
    title:'CarPool',
    backgroundColor:'#fff'
});
var carpool = Titanium.UI.createTab({  
    title: 'CarPool',
    window: carpoolWindow
});

var carpoolLabel = Titanium.UI.createLabel({
	color:'#999',
	text:'List Car Pools',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

carpool.add(carpoolLabel);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(taxi);
tabGroup.addTab(carpool);

// open tab group
tabGroup.open();
