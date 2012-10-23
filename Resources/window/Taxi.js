(function(){

    var mainWindow,webView,extraNav;
    var label;
    
    var DataObj = require('app/lib/Data').Data;
    var Data = new DataObj();
    
    var page,tmp;

    var PopulatePage = function(_page){
        page = _page;

        Ti.API.info( page );
        tmp = eval( '(' + page + ')' );
        
        mainWindow.remove(label);
        
        webView = Titanium.UI.createWebView({
            id: 'about',
            url: '/window/Taxi.html',
            backgroundColor: 'transparent',
            scalesPageToFit: true
            });

        webView.addEventListener('load', function(){
            //Ti.API.info('webView loaded' + tmp);
            //Ti.API.info('webView loaded' + page);
            //Ti.App.fireEvent('pageReady', tmp[0]);
            
            Ti.API.info(L('taxi_copy'));
            var tmp = L('taxi_copy');
            webView.evalJS('locale_copy("'+tmp+'")');

        });
        mainWindow.add(webView);
        
        var callBtn = Titanium.UI.createButton({
                id: 'callBtn',
                title: 'Call',
                width: 70,
                height: 40,
                top: 10, left: '20%'
                });
        
        callBtn.addEventListener('click', function(e){
            Ti.API.info('YO! call: ' + tmp[0].phonenumber);
            Ti.App.fireEvent('weblink.click', {link:'tel:' + tmp[0].phonenumber});
        });

        var emailBtn = Titanium.UI.createButton({
                id: 'emailBtn',
                title: 'Email',
                width: 70,
                height: 40,
                top: 10, right: '20%'
                });
        
        emailBtn.addEventListener('click', function(e){
            Ti.API.info('YO! email: ' + tmp[0].email);
            Ti.App.fireEvent('weblink.click', {link: 'mailto:' + tmp[0].email});
        });


        extraNav = Titanium.UI.createView({
                    id: 'extraNav',
                    width: '100%',
                    height: 60,
                    bottom: 45,
                    backgroundImage: '/images/footer.jpg'
                });

        extraNav.add(callBtn);
        extraNav.add(emailBtn);

        mainWindow.add(extraNav);
        /*
        var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ligula vitae sapien imperdiet pretium ac ac lorem. Sed in erat ante. Fusce nec consequat libero. Nulla facilisi.';
        var copy = Titanium.UI.createLabel({
            text: 'Taxi Funäsdalen\n' + text + '\n\n' + tmp[0].phonenumber + '\n' + tmp[0].email + '\n' + tmp[0].address,
            color: '#333',
            //height: 'auto',width: 'auto',
            textAlign: 'left', verticalAlign: 'top',
            top: -150, right: 10, bottom: 0, left: 10,
            font:{ fontSize:14, fontWeight: 'Light', fontFamily: 'Scout' }
        });
        
        mainWindow.add(copy);
        */
        // Fire the event that this is loaded and done
        //Ti.App.fireEvent('loading.done', {item:"Pages"});

    }

    var Window = function(){
        
        var page = 'taxi';
        /*
        scrollView = Titanium.UI.createScrollView({
            contentWidth: 'auto',
            contentHeight: 'auto',
        });
*/
        mainWindow = Titanium.UI.createView({
            id: 'taxi',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });

        label = Titanium.UI.createLabel({
            color:'#999',
            text:'Loading',
            font:{fontSize:20,fontFamily:'Helvetica Neue'},
            textAlign:'center',
            width:'auto'
        });

        mainWindow.add(label);
        /*
        fonttest1 = Titanium.UI.createLabel({
            color: '#000',
            text: 'Teniers',
            font: {fontSize: 15, fontFamily:'Teniers'},
            textAlign: 'center',
            top: 0
        });
        fonttest2 = Titanium.UI.createLabel({
            color: '#000',
            text: 'Battista',
            font: {fontSize: 15, fontFamily:'Battista'},
            textAlign: 'center',
            top: 30
        });
        fonttest3 = Titanium.UI.createLabel({
            color: '#000',
            text: 'Scout (light)',
            font: {fontSize: 15, fontFamily:'Scout Light'},
            textAlign: 'center',
            top: 60
        });
        fonttest4 = Titanium.UI.createLabel({
            color: '#000',
            text: 'Scout Condensed',
            font: {fontSize: 15, fontFamily:'ScoutCOnd'},
            textAlign: 'center',
            top: 90
        });
        
        mainWindow.add(fonttest1);
        mainWindow.add(fonttest2);
        mainWindow.add(fonttest3);
        mainWindow.add(fonttest4);
*/
        // Ask for the Pages
        Data.getPages( PopulatePage );
        
       
        return mainWindow;
    }

    function Test(){

    }
    
    //exports.PopulatePage = PopulatePage;
    exports.Window = Window;

})();
