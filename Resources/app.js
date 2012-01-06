// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

this.Date = require('/app/lib/date').Date;

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
    width: '100%',
    height: '100%',
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

//taxi.hide();
//mainView.add(taxi);

//taxi.hide();



Ti.App.addEventListener('menu.click', function(data){
    Ti.API.info('PLEASE!!!!!!!!! ' + data.btn); 
 
    var btn = data.btn;
       
    /**
     * Search for the view we want to show,
     * if it exists, it has been added before, then just show() it
     * if not, this is the first time and it needs to be added.
     */
    if (mainView.children){
        Ti.API.info('children is found for the mainView');
        
        var tmpIsFound = false;
        var numChildViews = mainView.children.length;
        for (var i=0; i < numChildViews; i++){
            Ti.API.info(i + '/' + numChildViews + ': ' +mainView.children[i].id);
            
            if (mainView.children[i].id == btn){
                mainView.children[i].show();
                tmpIsFound = true;
            } else {
                mainView.children[i].hide();
            }
        }
        
        // The view was not found, then add it
        if (tmpIsFound == false){
            Ti.API.info('first time adding view');
            mainView.add(eval(btn)); // Not very pretty, but it works...
        }

    } else {
        Ti.API.info('no children :( this should never happen...');
        mainView.add(eval(btn)); // Still not pretty, but...
    }
});

mainWindow.open();
