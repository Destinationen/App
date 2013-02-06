(function() {

    var mainWindow;
    var mapView;
    var loadingLabel;
    
    var g;
    var g_selected;

    var stops, routes;

    var DataObj = require('/app/lib/Data').Data;
    this.Data = new DataObj();

    var MapObj = require('/app/lib/Map').Map;    
    this.Map = new MapObj();
 
   
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
     * Callback for saving the stops for l8ter use in travelplans
     */
    var SaveStops = function(_stops){
        var resources = eval( '(' + _stops + ')' );
        
        stops = resources;
        // I think this will be enough, otherwise we have to create some queue
        //initPopUp();
    }
    
    // Go back from timetable to search view
    /*
    var goBack = function(){
        timeTableView.hide();
        picker_view.show();
        mapResultsView.show();

        mapPopUp.setLeftNavButton(closeBtn);
        mapPopUp.setRightNavButton(searchBtn);
    }
    */

    /**
     * Callback for populating the routes on the map
     * 
     * @param   routes  A JSON obj with routes
     */
    var PopulateRoutes = function(routes){
        
        routes = eval( '(' + routes + ')' );
        
        Ti.API.info('PopulateRoutes()');
                
        // Routesa
        for (var i = 0; i < routes.length; i++){

            Ti.API.info('Routes');

            var locations = new Array();
            for (var u=0;u<routes[i].locations.length;u++){
                var location = {latitude: routes[i].locations[u].lon, longitude: routes[i].locations[u].lat};
                locations[u] = location;
            }

            Ti.API.info(locations.length);

            var route = {
                name: stops[i].name,
                points: locations,
                color: "#bd2716",
                width: 4,
                id: stops[i].id
            };
            
            Ti.API.info(route.name);

            mapView.addRoute(route);
        }
        //Ti.API.info('Added Map Annotations & Routes');
        
        Data.getStops(SaveStops);
    }

    function Window(){

        mainWindow = Titanium.UI.createView({
            id: 'map'
        });
       
        /**
         * Just a temp thing...
         * so we can decide when to start loading data
         */
        loadingLabel = Titanium.UI.createLabel({
            color:'#999',
            text:'Loading...',
            font:{fontSize:20,fontFamily:'Helvetica Neue'},
            textAlign:'center',
            width:'auto'
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
        Data.getRoutes(PopulateRoutes);
        
        return mainWindow;
    }

    exports.Window = Window;

})();
