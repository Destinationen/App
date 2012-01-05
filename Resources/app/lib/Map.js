(function(){
   

    function Map(){

        this.view = Titanium.Map.createView({
	            mapType: Titanium.Map.STANDARD_TYPE,
	            region: {latitude: 62.545376, longitude: 12.544772, latitudeDelta: .1, longitudeDelta: .1},
	            animate: true,
	            regionFit: true,
	            userLocation: false
            });
        
    }
    
    exports.Map = Map;

})();
