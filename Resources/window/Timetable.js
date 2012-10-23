(function(){

    var mainView;
    
    var Window = function(){
        
        // What is this even used for?
        var page = 'timetable';

        mainView = Titanium.UI.createWebView({
            id: 'timetable',
            //url: '/window/FF_Skidbuss_A4_2012.pdf',
            scalesPageToFit: true,
            url: '/window/Timetable.html',
            backgroundColor:'transparent'
            });

        return mainView;
    }
    
    exports.Window = Window;

})();
