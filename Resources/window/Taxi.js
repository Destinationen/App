(function(){

    var mainWindow,webView,extraNav;
    var label;
    
    var DataObj = require('app/lib/Data').Data;
    var Data = new DataObj();
    
    var page,tmp;

    var PopulatePage = function(_page){
        page = _page;

        tmp = eval( '(' + page + ')' );
        
        mainWindow.remove(label);
        
        webView = Titanium.UI.createWebView({
            id: 'about',
            url: '/window/Taxi.html',
            backgroundColor: 'transparent',
            scalesPageToFit: true
            });

        webView.addEventListener('load', function(){
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
    }

    var Window = function(){
        
        var page = 'taxi';
       
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
        
        Ti.API.info("Taxi Page Loading");
        // Ask for the Pages
        Data.getPages( PopulatePage );
       
        return mainWindow;
    }

    function Test(){

    }
    
    exports.Window = Window;

})();
