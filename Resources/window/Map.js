(function() {

    var mainWindow;
    var mapView;
    
    var g;
    var g_selected;

    var stops, routes;

    var DataObj = require('/app/lib/Data').Data;
    this.Data = new DataObj();

    var MapObj = require('/app/lib/Map').Map;    
    this.Map = new MapObj();

    var SearchObj = require('/app/lib/Search');
    this.Search = new SearchObj();

   
    Date = require('/app/lib/date').Date;
    
    var traveldata = {
                        'from': {
                                'title': '',
                                'id': ''},
                        'to': {
                                'title': '',
                                'id': ''},
                        'date': {
                                'raw': '',
                                'string': ''
                                }
                    };

    /**
     * Callback for populating the routes on the map
     * 
     * @param   routes  A JSON obj with routes
     */
    var PopulateAnnotations = function(stops){
        
        stops = eval( '(' + stops + ')' );
        Ti.API.info(stops);

        Ti.API.info('Adding Map Annotations');


        mapView.addEventListener('click',function(evt){
            var annotation = evt.annotation;
            var title = evt.title;
            var aid = annotation.id;
            var clickSource = evt.clicksource;
            
            if (clickSource == 'rightButton'){
                Ti.API.info("open the search map!");
                this.mapPopUp = Titanium.UI.createWindow({
                    title: "Sök",
                    modal: true,
                    fullscreen: true,
                    width: '100%',
                    height: '100%',
                });
                this.mapPopUp.add(Search.getView());
                this.mapPopUp.open();
            }
             
        });

        var stopsData = [];
        Ti.API.info('numStops: ' + stops.length);
        for (var i=0;i<stops.length;i++){

            stopsData[i] = Ti.UI.createPickerRow({id: stops[i].id, title: stops[i].title});

            var annotation = Titanium.Map.createAnnotation({
                latitude: stops[i].longitude,
                longitude: stops[i].latitude,
                title: stops[i].title,
                subtitle: L('map_annotation_more','Click to travel from'),
                pincolor: Titanium.Map.ANNOTATION_GREEN,
                rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
                animate: true,
                id: stops[i].id
            });
            mapView.addAnnotation(annotation);
        }

    }

    function Window(){

        mainWindow = Titanium.UI.createView({
            id: 'map'
        });
       
        mapView = Map.view;
        
        mainWindow.add(mapView);

        Ti.Geolocation.purpose = "By accepting you can find the closest skibus stop to your location!";
        
        if (Ti.Geolocation.locationServicesEnabled) {    
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 5;
            Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

            Ti.Geolocation.getCurrentPosition(function(e) {
                if (e.error) {
                    Ti.API.error('geo - current position' + e.error);
                    return;
                } else {
                    var currentRegion = {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude,
                        animate:true,
                        latitudeDelta:0.4,
                        longitudeDelta:0.4
                    };

                    mapView.setLocation(currentRegion); 
                }

            });
        } else {
            Ti.API.error('geo turned off');
        }
        
        // Ask for the Routes
        Data.getStops(PopulateAnnotations);
        
        return mainWindow;
    }

    exports.Window = Window;

})();
