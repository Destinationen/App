(function() {

    var mainWindow;
    var mapView;
    var loadingLabel;
    
    var DataObj = require('/app/lib/Data').Data;
    this.Data = new DataObj();

    var MapObj = require('/app/lib/Map').Map;    
    this.Map = new MapObj();


    /**
     * Callback for populating the routes on the map
     * 
     * @param   routes  A JSON obj with routes
     */
    var PopulateRoutes = function(routes){
        
        var resources = eval( '(' + routes + ')' );

        Ti.API.info( resources );

        // Removes the loading label
        //mainWindow.remove(loadingLabel); // DONT WORK...

        // Stops
        for (var i=0; i< resources.stops.length; i++){
            var annotation = Titanium.Map.createAnnotation({
                latitude: resources.stops[i].lon,
                longitude: resources.stops[i].lat,
                title: resources.stops[i].name,
                subtitle: resources.stops[i].description,
                pincolor: Titanium.Map.ANNOTATION_GREEN,
                animate: true,
                id: resources.stops[i].id
            });

            mapView.addAnnotation(annotation);
        }

        // Routes
        for (var i=0; i< resources.routes.length; i++){

            Ti.API.info('Routes');

            var locations = new Array();
            for (var u=0;u<resources.routes[i].locations.length;u++){
                var location = {latitude: resources.routes[i].locations[u].lon, longitude: resources.routes[i].locations[u].lat};
                locations[i] = location;
            }

            Ti.API.debug(locations);

            var route = {
                name: resources.stops[i].name,
                points: locations,
                color: "#ffccdd",
                width: 2,
                id: resources.stops[i].id
            };

            //mapView.addRoute(route);
        }

        Ti.API.debug('Added Map Annotations & Routes');
        //win1.add(response);
        //alert('success');
        

    }

    function Window(){
        
        mainWindow = Titanium.UI.createView({
        //mainWindow = Titanium.UI.createWindow({
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


        /**
         * Just a temp thing...
         * The button for the temp label above.
         * Right now we want to control when to start loading
         */
        var getRoutesBtn = Titanium.UI.createButton({
            title: 'Load',
            top: 120,
            width: 200,
            height: 50
        });

        getRoutesBtn.addEventListener('click', function() {
            Data.getRoutes(PopulateRoutes);
        });

        /*
        this.addMapAnnotations = function(results){
        Ti.API.info(results);
        };
        this.routes = this.Data.getRoutes(this.addMapAnnotations);
        */
        
        mapView = Map.view;
        //mapView.width = 'auto';
        //mapView.top = 50;
        //mapView.height = 150;
        
        
        // Ask for the Routes
        Data.getRoutes(PopulateRoutes);


        mainWindow.add(mapView);
        //mainWindow.add(loadingLabel);
        
        return mainWindow;
    }

    exports.Window = Window;

})();
