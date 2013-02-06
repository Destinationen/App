// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

this.Date = require('/app/lib/date').Date;

var osname = Ti.Platform.osname;
if (osname === 'iphone' || osname === 'ipad') {
    var platform = 'ios';
} else {
    var platform = 'android';
}

// Counter, when its done, the loading is done.
var loadCounter = 0;
var loadTotal = 5;
Ti.App.addEventListener('loading.done', function(){
    loadCounter++;
    Ti.API.info(loadCounter + "/" + loadTotal);
    if (loadCounter == loadTotal){
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
        Ti.API.info("minimum loading time reached, continue if loading is done!");
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
var SplashWindow, splash, SearchWindow, search, MapWindow, map, TimetableWindow, timetable, TaxiWindow, taxi, AboutWindow, about, StartpageWindow, startpage, WebcamWindow, webcam;

SearchWindow = require('/window/Search').Window;
search = new SearchWindow();

MapWindow = require('/window/Map').Window;
map = new MapWindow();

TimetableWindow = require('/window/Timetable').Window;
timetable = new TimetableWindow();

TaxiWindow = require('/window/Taxi').Window;
taxi = new TaxiWindow();

WebcamWindow = require('/window/Webcam').Window;
webcam = new WebcamWindow();

AboutWindow = require('/window/About').Window;
about = new AboutWindow();

StartpageWindow = require('/window/Startpage').Window;
startpage = new StartpageWindow();

var startup_page = 'startpage';

function initApp(){
    splash.close({transition:Ti.UI.iPhone.AnimationStyle.CURL_UP});
    mainWindow.open();

    Ti.App.fireEvent('menu.click', {btn: startup_page});
    Ti.App.fireEvent('menu.switch', {btn: startup_page});
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
            mainView.add(eval(btn)); // Not very pretty, but it works...
        }

    } else {
        mainView.add(eval(btn)); // Still not pretty, but...
    }
});


// This is a window, the others are accualy views, refacor this at some point!
SplashWindow = require('/window/Splash').Window;
splash = new SplashWindow();

// The calendar module
//Titanium.Calendar = Ti.Calendar = require('ag.calendar');

// Use eventkit as datasource
//Ti.Calendar.dataSource('eventKit');

// Background services
/*
var service = Ti.App.iOS.registerBackgroundService({
    url:'bg.js'
    });
*/

// Open the splash
splash.open();
