(function(){
   
    var menuView, menuBgView;
    var toggleMenuBtn, menuOpenState = false;

    var iconPositions = [];
    
    var buttons = new Array();

    var Initialize = function(){
        
        menuView = Titanium.UI.createView({
                width: '100%',
                height: 300,
                top: -217
            });
        
        menuBgView = Ti.UI.createView({
                backgroundImage: '/images/header.png',
                width: '100%',
                height: 274,
                top: 0
            });
        menuView.add(menuBgView);

        toggleMenuBtn = Titanium.UI.createButton({
                backgroundImage: '/images/menu_btn.png',
                style: 0,
                width: 32,
                height: 24,
                top: 268
            });

        toggleMenuBtn.addEventListener('click', function(e){
                if (!menuOpenState) {
                    menuView.top = -217 + ((iconPositions.length-1) * 35) + 5;
                    menuOpenState = true;
                    toggleMenuBtn.backgroundImage = '/images/menu_btn_up.png';
                } else {
                    menuView.top = -217;
                    menuOpenState = false;
                    toggleMenuBtn.backgroundImage = '/images/menu_btn.png';
                }
            });
        menuView.add(toggleMenuBtn);

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
        
        // There is always going to be exceptions I guess
        var logo = Titanium.UI.createButton({
            id: 'startpage',
            image: '/images/funasfjallen.png',
            style: 0,
            width: 40,
            height: 60,
            top: 228,
            left: 10
        });
      
        logo.addEventListener('click', function(args){
            Ti.App.fireEvent('menu.click', {btn: 'startpage'});
            Ti.App.fireEvent('menu.switch', {btn: 'startpage'});
        });
          
        menuView.add(logo);
     
        /**
         * Add the menu Items, they will arrive in the revesed order
         */
        addItem({ id:'taxi', title:'taxi', style:0, align: 'right', icon: '16-car.png', row: 1 });
        addItem({ id:'webcam', title:'webcam', style:0, align: 'right', icon: 'hardware-webcam.png', row: 1 });
        
        addItem({ id:'about', title:'about', style:0, align: 'right', icon: '42-info.png', row: 0 });

        addItem({ id:'timetable', title:'timetable', style:0, align: 'right', icon: '11-clock.png', row: 0 });
        addItem({ id:'map', title:'map', style:0, align: 'right', icon: '103-map.png', row: 0 });
        addItem({ id:'search', title:'search', style:0, align: 'right', icon: '06-magnify.png', row: 0 });

        return menuView;
        
    }
    
    var getView = function(){
        return menuView;
    }
    

    var addItem = function(args){

        var btn = Titanium.UI.createButton({
            id: args.id,
            title: L(args.title),
            font: { fontSize:20, fontFamily: 'Teniers'},
            style: args.style,
            top: 228,
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
            btn.title = '';
        }
        
        if (!iconPositions[args.row]) {
            iconPositions[args.row] = 15;
        }

        if (args.align == 'right'){
            btn.right = iconPositions[args.row];
        } else if (args.align == 'left') {
            btn.left = iconPositions[args.row];
        }
        iconPositions[args.row] = iconPositions[args.row] + btn.width + 8;
        
        btn.top = (228 - (args.row * 35));
    }
 
    exports.Menu = Initialize;   
    exports.view = menuView;
    
    exports.getView = getView;
})();
