// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

this.Date = require('date').Date;

var MapWindow = require('/window/Map').Window;
var map = new MapWindow();

var TaxiWindow = require('/window/Taxi').Window;
var taxi = new TaxiWindow();


/*
var image = Titanium.UI.createImageView({
        url: 'header.jpg',
        view.add(image)
    });
*/


var mainWindow = Titanium.UI.createWindow({
    id: 'MainWindow',
    title: 'MainWindow',
    navBarHidden: true,
    backgroundColor: '#eaded0',
    fullscreen: true
});




var mainView = Titanium.UI.createView({
    width: 'auto',
    height: 'auto',
    top: 45
});

mainWindow.add(mainView);


var MenuObj = require('/app/lib/Menu').Menu;    
var Menu = new MenuObj();
var MenuView = Menu.view;
mainWindow.add(MenuView);


var logo = Titanium.UI.createView({
    backgroundImage: 'images/funasfjallen.png',
    width: 35,
    height: 52,
    top: 10,
    left: 10
});
        
mainWindow.add(logo);

// Open this as default
mainView.add(map);




Ti.App.addEventListener('menu.click', function(btn){
    
    // Remove All sub-views
    mainView.remove(taxi);
    mainView.remove(map);
    
    // Add tha one we wanted
    switch(btn)
    {
        case 'map':
            Ti.API.info('Switch to Window Map');
            //taxi.hide();
            mainView.add(map);
        break;
        case 'taxi':
            Ti.API.info('Switch to Window Taxi');
            //taxi.open();
            mainView.add(taxi);
        break;
    }
});

mainWindow.open();
