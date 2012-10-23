(function(){

    var mainView;
    var label;
    var image1,image2,image3;
    
    var Window = function(){
        
        var page = 'about';
        
        mainView = Titanium.UI.createWebView({
            id: 'about',
            url:'/window/About.html',
            backgroundColor:'transparent'
            });

        mainView.addEventListener('load', function(){
            Ti.API.info(L('about_copy'));
            var tmp = L('about_copy');
            mainView.evalJS('locale_copy("'+tmp+'")');
        });

        //Ti.API.info(Ti.Locale.getString('about_copy'));
    
        return mainView;
    }
    
    exports.Window = Window;

})();
