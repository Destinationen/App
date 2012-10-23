(function(){

    var mainView;
    
    var Window = function(){
        
        var page = 'webcam';
        
        mainView = Titanium.UI.createWebView({
            id: 'webcam',
            url:'/window/Webcam.html',
            backgroundColor:'transparent'
            });
        
        // We are going to have to hook to the load/unload events to create and destroy the timers for getting images
        mainView.addEventListener('load', function(){
        });

        return mainView;
    }
    
    exports.Window = Window;

})();
