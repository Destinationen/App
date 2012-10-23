(function(){

    var mainView;
    
    var SearchClass = require('/app/lib/Search');
    var Search = new SearchClass();
   
    var Window = function(){
       
        var page = 'search';

        mainView = Titanium.UI.createView({
            id: 'search',
            backgroundColor:'transparent'
            });
        
        var searchView = Search.getView();
        mainView.add(searchView);

        return mainView;
    }
    
    exports.Window = Window;

})();
