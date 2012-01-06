(function(){

    var mainWindow;
    var label;
    
    var DataObj = require('app/lib/Data').Data;
    var Data = new DataObj();
    
    //var MenuObj = require('/app/lib/Menu').Menu;    
    //var Menu = new MenuObj();

    var PopulatePage = function(page){
        
        Ti.API.info( page );
        var tmp = eval( '(' + page + ')' );
        
        mainWindow.remove(label);

        var copy = Titanium.UI.createLabel({
            text: tmp[0].phonenumber + '\n' + tmp[0].email + '\n' + tmp[0].address,
            color: '#333',
            height: 'auto',
            width: 'auto',
            textAlign: 'left',
            font:{ fontSize:13, fontFamily: 'Helvetica Neue' },
            verticalAlign: 'top'
        });

        mainWindow.add(copy);

    }

    var Window = function(){
        
        var page = 'taxi';
       
        //var DataObj = require('/app/lib/Data').Data;
        //this.Data = new DataObj();

        mainWindow = Titanium.UI.createView({
        //mainWindow = Titanium.UI.createWindow({
            id: 'taxi'
        });

        label = Titanium.UI.createLabel({
            color:'#999',
            text:'Loading',
            font:{fontSize:20,fontFamily:'Helvetica Neue'},
            textAlign:'center',
            width:'auto'
        });

        mainWindow.add(label);
        

        // Allways add the menu last, so its at the top of the stack.
        //MenuView = Menu.view;
        //mainWindow.add(MenuView);

        //Ti.API.info( PopulatePage );
        // Ask for the Routes
        Data.getPages( PopulatePage );
        
       
        return mainWindow;
    }

    function Test(){

    }
    
    //exports.PopulatePage = PopulatePage;
    exports.Window = Window;

})();
