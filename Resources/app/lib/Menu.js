(function(){
   

    function Menu(){

        this.view = Titanium.UI.createView({
                backgroundColor: 'green',
                backgroundImage: '../../images/header.jpg',
                width: 'auto',
                height: 50,
                top: 0
            });
        
        var button_map = Titanium.UI.createButton({
                title: 'Map',
                left: 60
            });
        button_map.addEventListener('click', function(e){
            Titanium.API.info('You clicked the Map Btn');
            Ti.App.fireEvent('menu.click', 'map');
        });

        this.view.add(button_map);
        
        var button_taxi = Titanium.UI.createButton({
                title: 'Taxi',
                left: 110
            });
        button_taxi.addEventListener('click', function(e){
            Titanium.API.info('You clicked the Taxi Btn');
            Ti.App.fireEvent('menu.click', 'taxi');
        });

        this.view.add(button_taxi);
    }
    
    exports.Menu = Menu;

})();
