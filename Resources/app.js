// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

this.Date = require('/app/lib/date').Date;

// Counter, when its done, the loading is done.
var loadCounter = 0;
var loadTotal = 4;
Ti.App.addEventListener('loading.done', function(){
    loadCounter++;
    
    if (loadCounter == loadTotal){
        //splash.close({transition:Ti.UI.iPhone.AnimationStyle.CURL_UP});
        //mainWindow.open();
        initApp();
    }
});

/**
 * Creates a minimum startup time
 */
var mt = 0;
var timetowait = 3;
mtimer = setInterval(function(){
    mt++;
    if (mt == timetowait){
        clearInterval(mtimer);
        Ti.App.fireEvent('loading.done');
    }
}, 1000);


// This opens weblinks in a external browser
// Move this to its own lib l8ter maybe
Ti.App.addEventListener('weblink.click', function(e){
    Ti.API.info('weblink.click ' + e.link);
    Titanium.Platform.openURL( e.link );
});

// Define a bunch of windows and stuff
var SplashWindow, splash, MapWindow, map, TimetableWindow, timetable, TaxiWindow, taxi, AboutWindow, about;

MapWindow = require('/window/Map').Window;
map = new MapWindow();

TimetableWindow = require('/window/Timetable').Window;
timetable = new TimetableWindow();

TaxiWindow = require('/window/Taxi').Window;
taxi = new TaxiWindow();

AboutWindow = require('/window/About').Window;
about = new AboutWindow();


function initApp(){
    splash.close({transition:Ti.UI.iPhone.AnimationStyle.CURL_UP});
    mainWindow.open();

    Ti.App.fireEvent('menu.click', {btn: 'map'});
    Ti.App.fireEvent('menu.switch', {btn: 'map'});
}

var mainWindow = Titanium.UI.createWindow({
    id: 'MainWindow',
    title: 'MainWindow',
    navBarHidden: true,
    backgroundImage: 'images/Default.jpg',
    width: '100%',
    height: '100%',
    fullscreen: true
});

/*
var mainView = Titanium.UI.createScrollView({
    contentWidth: '100%',
    contentHeight: '100%',
    top: 45,
    showVerticalScrollIndicator: true,
    showHorizontalScrollIndicator: true,
    visible: true, 
});
*/

var mainView = Titanium.UI.createView({
    width: '100%',
    height: '100%',
    backgroundImage: '/images/Default.jpg',
    top: 45
});

mainWindow.add(mainView);


var MenuObj = require('/app/lib/Menu').Menu;
var Menu = new MenuObj();
mainWindow.add(Menu);


var logo = Titanium.UI.createView({
    backgroundImage: '/images/funasfjallen.png',
    width: 40,
    height: 60,
    top: 10,
    left: 10
});
        
mainWindow.add(logo);


Ti.App.addEventListener('menu.click', function(data){
 
    var btn = data.btn;
       
    /**
     * Search for the view we want to show,
     * if it exists, it has been added before, then just show() it
     * if not, this is the first time and it needs to be added.
     */
    if (mainView.children){
        var tmpIsFound = false;
        var numChildViews = mainView.children.length;
        for (var i=0; i < numChildViews; i++){
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


// Opens the startpage 
//Ti.App.fireEvent('menu.click', {btn: 'about'});

// This is a window, the others are accualy views, refacor this at some point!
SplashWindow = require('/window/Splash').Window;
splash = new SplashWindow();


// Open the splash
splash.open();

