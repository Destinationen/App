(function(){

    var mainView;
    
    var Window = function(){
        
        var page = 'startpage';
        
        mainView = Titanium.UI.createView({
            id: 'startpage',
            backgroundColor:'transparent'
            });
        
        var h1 = Ti.UI.createLabel({
                text: 'Welcome',
                height: 'auto',
                width: 'auto',
                top: 60,
                left: 20,
                font: { fontSize:45, fontFamily: 'Teniers'},
                shadowColor:'#333',
                shadowOffset: {x:0, y:1}
            });
        mainView.add(h1);
        
        var search_btn = Titanium.UI.createButton({
            id: "search",
            title: "Sök",
            font: { fontSize:20, fontFamily: 'Teniers'},
            top: 208,
            width: 200,
            height: 30,
            shadowColor:'#333',
            shadowOffset: {x:0, y:1}
        });
     
        search_btn.addEventListener('click', function(e){
            Ti.App.fireEvent('menu.click', {btn: 'search'});
            Ti.App.fireEvent('menu.switch', {btn: 'search'});
        });

        mainView.add(search_btn);

        var map_btn = Titanium.UI.createButton({
            id: "map",
            title: "Kartsök",
            font: { fontSize:20, fontFamily: 'Teniers'},
            top: 260,
            width: 200,
            height: 30,
            shadowColor:'#333',
            shadowOffset: {x:0, y:1}
        });
     
        map_btn.addEventListener('click', function(e){
            Ti.App.fireEvent('menu.click', {btn: 'map'});
            Ti.App.fireEvent('menu.switch', {btn: 'map'});
        });

        mainView.add(map_btn);


        var map2_btn = Titanium.UI.createButton({
            id: "map_test",
            title: "Kartsök test",
            font: { fontSize:20, fontFamily: 'Teniers'},
            top: 300,
            width: 200,
            height: 30,
            shadowColor:'#333',
            shadowOffset: {x:0, y:1}
        });
     
        map2_btn.addEventListener('click', function(e){
            alert('');
        });

        mainView.add(map_btn);
        // Return the view
        return mainView;
    }
    
    exports.Window = Window;

})();
