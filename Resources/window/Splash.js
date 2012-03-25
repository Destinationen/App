(function(){

    var mainWindow;
    var label;
    
    var DataObj = require('app/lib/Data').Data;
    var Data = new DataObj();
    
    /* 
    var inter;
    var windowDone = function(){
        Ti.App.fireEvent('loading.done');
        clearInterval(inter);
    }
    */
    
    var Window = function(){
        
        var page = 'splash';
        
        //inter = setInterval("windowDone()", 2500);
        
        // dont work
        //Ti.App.fireEvent('loading.done', {}, 3500);
        
        mainWindow = Titanium.UI.createWindow({
            id: 'splash',
            backgroundImage: '/images/Splash@2x.png',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            fullscreen: true
        });

        label = Titanium.UI.createLabel({
            color:'#000',
            shadowColor:'#f2f2f2',
            shadowOffset: {x:0, y:1},
            text:'Loading...',
            font:{fontSize:30,fontFamily:'ScoutCond'},
            textAlign:'center',
            top: 210,
            width:'auto'
        });

        mainWindow.add(label);
              
        return mainWindow;
    }
   
    exports.Window = Window;

})();
