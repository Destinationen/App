(function(){
   
    var menuView;

    var leftBtnCount=0;
    var rightBtnCount=0;   
    
    var buttons = new Array();

    var Initialize = function(){
        
        Ti.API.info('Menu.Initialize()');

        menuView = Titanium.UI.createView({
                backgroundImage: '/images/header.jpg', //with iPhone, the url seems to originate from Resources, while Android from this file
                width: '100%',
                height: 60,
                top: 0
            });
        
        // This alters the apperanse of the state
        Ti.App.addEventListener('menu.switch', function(data){
            for(var i=0;i<buttons.length;i++){
                if (buttons[i].id != data.btn){
                    buttons[i].color = "#fff";
                    buttons[i].image = 'assets/images/icons/white/' + buttons[i].backgroundDisabledImage;
                } else {
                    buttons[i].color = "#000";
                    buttons[i].image = 'assets/images/icons/grey/' + buttons[i].backgroundDisabledImage;
                }
             }
        });

     
        /**
         * Add the menu Items
         */
        addItem({ id:'map', title:'map', style:0, align: 'left', icon: '103-map.png' });
        addItem({ id:'timetable', title:'timetable', style:0, align: 'left', icon: '11-clock.png' });
        
        addItem({ id:'taxi', title:'taxi', style:0, align: 'left', icon: '16-car.png' });
        //addItem({ id:'carrental', title:'carrental', style:0, align: 'left' });
        
        addItem({ id:'about', title:'about', style:0, align: 'right', icon: '42-info.png' });


        return menuView;
        
    }
    
    var getView = function(){
        return menuView;
    }
    
    var currentLeftWidth = 15;
    var currentRightWidth = 15;
    var addItem = function(args){

        var btn = Titanium.UI.createButton({
            id: args.id,
            title: L(args.title),
            font: { fontSize:20, fontFamily: 'Teniers'},
            style: args.style,
            top: 15,
            width: 40,
            height: 30,
            shadowColor:'#333',
            shadowOffset: {x:0, y:1}

        });
     
        btn.addEventListener('click', function(e){
            Ti.App.fireEvent('menu.click', {btn: args.id});
            Ti.App.fireEvent('menu.switch', {btn: args.id});
        });

        buttons.push(btn);
        menuView.add( buttons[ (buttons.length-1) ] );
        
        if (args.icon){
            btn.image = 'assets/images/icons/white/' + args.icon;
            btn.backgroundDisabledImage = args.icon;
            //btn.imageName = args.icon;
            //btn.backgroundImage = 'assets/images/' + args.icon;
            btn.title = '';
        }

        if (args.align == 'right'){
            Ti.API.info(currentRightWidth);
            //currentRightWidth = (btn.width - currentRightWidth - 8);

            btn.right = currentRightWidth;
        } else if (args.align == 'left') {
            Ti.API.info(currentLeftWidth);
            currentLeftWidth = (btn.width + currentLeftWidth + 8);
            btn.left = currentLeftWidth;
        }

    }
 
    exports.Menu = Initialize;   
    exports.view = menuView;
    
    exports.getView = getView;
})();
