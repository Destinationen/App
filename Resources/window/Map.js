(function() {

    var mainWindow;
    var mapPopUp, annotationInfo, mapResultsView, ttv, timeTableView, timeTablePopUp;
    var picker_view, picker_date, picker_stop;
    var mapView;
    var loadingLabel;
    
    var tmpStopBtn, saveToCalendarBtn, closeBtn, searchBtn, backBtn;
    var travelFromStopBtn, travelToStopBtn;
    var travelTime;
    var ATC;
    
    var testvar = "meneee";

    var g;
    var g_selected;

    var stops, routes;

    var DataObj = require('/app/lib/Data').Data;
    this.Data = new DataObj();

    var MapObj = require('/app/lib/Map').Map;    
    this.Map = new MapObj();
 
    var ATCObj = require('/app/lib/addToCalendar');
    this.ATC = new ATCObj();
    
   
    Date = require('/app/lib/date').Date;
    
    var traveldata = {
                        'from': {
                                'title': '',
                                'id': ''},
                        'to': {
                                'title': '',
                                'id': ''},
                        'date': {
                                'raw': '',
                                'string': ''
                                }
                    };

    /**
     * Callback for saving the stops for l8ter use in travelplans
     */
    var SaveStops = function(_stops){
        var resources = eval( '(' + _stops + ')' );
        
        stops = resources;

        // I think this will be enough, otherwise we have to create some queue
        initPopUp();
    }
    
    // Go back from timetable to search view
    var goBack = function(){
        timeTableView.hide();
        picker_view.show();
        mapResultsView.show();

        mapPopUp.setLeftNavButton(closeBtn);
        mapPopUp.setRightNavButton(searchBtn);
    }

    /**
     * Callback for creating a timetable of the possible departure dates
     */
    var ListDepartures = function(_results){

        Ti.API.info('List Departures!');
        var results = eval('('+_results+')');
        Ti.API.info(results);
        var that = this;

        var headerTitleLabel = Ti.UI.createLabel({
            text: traveldata.from.title + ' - ' + traveldata.to.title + '\n' + traveldata.date.string,
            font: {fontSize:16, fontWeight: 'bold'},
            width: 'auto',
            textAlign: 'left',
            left: 10,
            height: 'auto'
        });
        
        ttv = Ti.UI.createView({
            top: 45,
            height: 60
        });
        ttv.add(headerTitleLabel);

        timeTableView = Ti.UI.createTableView({
            style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
            headerView: ttv
        });
        
        var data = new Array();
        var numTrips = results.length;
        
        // No trips that day, to bad
        if (numTrips == 0){
            alert('Sorry There are no trips this day, between these stops.');
            return false;
        }
        
        // Localeize this at some point
        mapPopUp.title = "Search";
        
        for (var t=0;t<numTrips;t++){
            var numRows = results[t].length;
            
            var rowId = results[t][0].stopid;
            var rowLineId = results[t][0].tripId;
            var rowName = results[t][0].stop;
            var rowLine = results[t][0].line;
            var rowDeparture = results[t][0].departure;
            
            var row = new Object();

            // Create a subtableview for the stops
            var subdata = new Array();
            
            // If we are within the departure and destination location
            var within = false;

            for (var r=0;r<numRows;r++){
                var subRowId = results[t][r].stopid;
                var subRowLineId = results[t][r].tripId;
                var subRowName = results[t][r].stop;
                var subRowLine = results[t][r].line;
                var subRowDeparture = results[t][r].departure;

                var atcBtn = Ti.UI.createButton({
                    title: '>',
                    top: 10,
                    right: 10
                }); 
                
                atcBtn.addEventListener('click', function(e){
                    //this.ATC.submit(); 
                    Ti.API.info(this.ATC);
                });

                var subTitleLabel = Ti.UI.createLabel({
                    text: subRowName,
                    font: {fontSize:16, fontWeight: 'bold'},
                    width: 'auto',
                    textAlign: 'left',
                    top: 14,
                    left: 10,
                    height: 16
                });

                var subTimeLabel = Ti.UI.createLabel({
                    text: new Date.parse(subRowDeparture.date).toString("HH:mm"),
                    font: {fontSize:12, fontWeight: 'bold'},
                    width: 'auto',
                    textAlign: 'right',
                    top: 15,
                    right: 50,
                    height: 12
                });
                
                var subRow = Ti.UI.createTableViewRow();
                subRow.backgroundColor = "#dcdcdc";
                subRow.isParent = false;
                subRow.opened = false;
                subRow.add(subTitleLabel);
                subRow.add(subTimeLabel);
                
                subRow.hasChildren=false;
                subRow.className = 'TimeTableSubRow';
                
                // Start adding when we hit the departure id
                if (travelFromStopBtn == subRowId) {
                    subRow.isParent = true;
                    subRow.backgroundColor = "#ffffff";
                    subRow.className = 'TimeTableParentRow';
                    subRow.height = '58px';

                    var destinationTitleLabel = Ti.UI.createLabel({
                        text: traveldata.to.title,
                        font: {fontSize: 16, fontWeight: 'bold'},
                        width: 'auto',
                        top: 30,
                        left: 10,
                        height: 16
                    });
                    subRow.add(destinationTitleLabel);

                    var destinationTimeLabel = Ti.UI.createLabel({
                        text: 'XX:XX',
                        font: {fontSize: 12, fontWeight: 'bold'},
                        width: 'auto',
                        textAlign: 'right',
                        top: 30,
                        right: 50,
                        height: 12
                    });
                    subRow.add(destinationTimeLabel);



                    row = subRow;
                }               

                if (true == within) {
                    Ti.API.info("eh: " + subRow);
                    subdata.push(subRow);
                } else {
                    //subRow.add(atcBtn);
                }

                // Start adding when we hit the departure id
                if (traveldata.from.id == subRowId) {
                    within = true;
                }
                // Stop adding when we hit the destination id
                if (traveldata.to.id == subRowId) {
                    within = false;
                }
            }
            Ti.API.info(row.height);
            row.sub = subdata;
            row.hasChild = true;
            data.push(row);
        }

        timeTableView.setData(data);
        timeTableView.addEventListener('click', function(e){

            var ATCObj = require('/app/lib/addToCalendar');
            this.ATC = new ATCObj();
            timeTableView.hide();
            mapPopUp.add(this.ATC.getView());
            
            /* 
            if (e.row.isParent){
                
                var currentIndex = e.index;

                if (e.row.opened == true){
                    e.row.opened = 'in action';
                    for (var i=0; i < e.row.sub.length; i++){
                        timeTableView.deleteRow(currentIndex + 1);
                    }
                    e.row.opened = false;
                } else if (e.row.opened == false) {
                    e.row.opened = 'in action';
                    Ti.API.info('e.row.sub.length: ' + e.row.sub.length);
                    for (var i=(e.row.sub.length-1); i>=0; i--){
                            Ti.API.info('currentIndex: '+currentIndex+' | e.row.sub['+i+']');
                            timeTableView.insertRowAfter(currentIndex, e.row.sub[i]);
                    }
                    e.row.opened = true;

                } else {
                    Ti.API.info('not opened, not closed');
                }
            }
            */
        });

        mapPopUp.setLeftNavButton(backBtn);
        //mapPopUp.setRightNavButton(saveToCalendarBtn);

        // Hide the current views
        picker_view.hide();
        
        //ttv.add(timeTableView);
        // Show timetable
        mapPopUp.add(timeTableView);
    }

    /**
     * Callback for populating the routes on the map
     * 
     * @param   routes  A JSON obj with routes
     */
    var PopulateRoutes = function(routes){
        
        routes = eval( '(' + routes + ')' );
        
        Ti.API.info('PopulateRoutes()');
        /*        
        // Routesa
        for (var i = 0; i < routes.length; i++){

            Ti.API.info('Routes');

            var locations = new Array();
            for (var u=0;u<routes[i].locations.length;u++){
                var location = {latitude: routes[i].locations[u].lon, longitude: routes[i].locations[u].lat};
                locations[u] = location;
            }

            Ti.API.info(locations.length);

            var route = {
                name: stops[i].name,
                points: locations,
                color: "#bd2716",
                width: 4,
                id: stops[i].id
            };
            
            Ti.API.info(route.name);

            mapView.addRoute(route);
        }
        //Ti.API.info('Added Map Annotations & Routes');
        */
        Data.getStops(SaveStops);
    }

    function initPopUp(){
        
        Ti.API.info('iniPopUp()');

        mapPopUp = Titanium.UI.createWindow({
            modal: true,
            fullscreen: true,
            width: '100%',
            height: '100%',
        });
        
        annotationInfo = Titanium.UI.createLabel({
            text: '',
            color: '#fff',
            textAlign: 'center',
            top: 250
        });
        mapPopUp.add(annotationInfo);
        
        picker_view = Titanium.UI.createWindow({
            height: 231, //251
            bottom: 0,
            zIndex: 3,
            visible: false
        });
       
        var todayDate = new Date.today();
        travelTime = todayDate.toString('yyyy-MM-dd');
        
        traveldata.date.raw = todayDate;
        traveldata.date.string = todayDate.toString('yyyy-MM-dd');
        
        var maxDate = new Date.today().set({month: 3}).moveToLastDayOfMonth();

        picker_date = Ti.UI.createPicker({
            type: Ti.UI.PICKER_TYPE_DATE,
            //minDate: todayDate,
            minDate: new Date(2011,0,1),
            maxDate: maxDate,
            value: todayDate,
            visible: false,
            selectionIndicator: true,
            bottom: 0
        });
        picker_stop = Ti.UI.createPicker({selectionIndicator: true, visible: false, bottom: 0});
        
        picker_stop.addEventListener('change', function(e){
            Ti.API.info(e.row.id + '/' + e.rowIndex + '/' + e.row.title);
            
            tmpStopBtn.current = e.rowIndex;

            // Check if its from/to
            if (tmpStopBtn.from){
                tmpStopBtn.title = 'From: ' + e.row.title;

                traveldata.from.title = e.row.title;
                traveldata.from.id = e.row.id;
            } else {
                tmpStopBtn.title = 'To: ' + e.row.title;

                traveldata.to.title = e.row.title;
                traveldata.to.id = e.row.id;
            }
        });
        picker_date.addEventListener('change', function(e){
            Ti.API.info(e.value);
            var tmpDate = e.value.getFullYear() + '-' + (e.value.getMonth()+1) + '-' + e.value.getDate();
            var goodDate = new Date.parse(tmpDate);
            tmpStopBtn.title = 'On: ' + goodDate.toString('yyyy-MM-dd');
            travelTime = goodDate.toString('yyyy-MM-dd');
            
            traveldata.date.raw = goodDate;
            traveldata.date.string = goodDate.toString('yyyy-MM-dd');
            
        });
        
        picker_view.add(picker_date);
        picker_view.add(picker_stop);
 
        searchBtn = Ti.UI.createButtonBar({
            labels: [L('search_btn','Search')],
            backgroundColor: '#a58d1e'
        });
        
        searchBtn.addEventListener('click', function(e){

            var tmp_result = '[[{"id":2035,"tripid":53,"departure":{"date":"2012-08-28 08:40:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalens Bussplan","stopid":264},{"id":2036,"tripid":53,"departure":{"date":"2012-08-28 08:43:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalsberget","stopid":281},{"id":2037,"tripid":53,"departure":{"date":"2012-08-28 08:45:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalens Fj\u00e4llkamping","stopid":282},{"id":2038,"tripid":53,"departure":{"date":"2012-08-28 08:51:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Flon","stopid":283},{"id":2039,"tripid":53,"departure":{"date":"2012-08-28 08:53:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Gruvgubben","stopid":284},{"id":2040,"tripid":53,"departure":{"date":"2012-08-28 08:54:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Macken","stopid":285},{"id":2041,"tripid":53,"departure":{"date":"2012-08-28 08:54:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Bj\u00f6rkliden","stopid":286},{"id":2042,"tripid":53,"departure":{"date":"2012-08-28 08:55:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Bruksvallarna, ICA Stigmyhrs","stopid":287},{"id":2043,"tripid":53,"departure":{"date":"2012-08-28 09:10:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Ramundberget","stopid":288}],[{"id":2086,"tripid":54,"departure":{"date":"2012-08-28 14:15:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalens Bussplan","stopid":264},{"id":2087,"tripid":54,"departure":{"date":"2012-08-28 14:18:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalsberget","stopid":281},{"id":2088,"tripid":54,"departure":{"date":"2012-08-28 14:20:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalens Fj\u00e4llkamping","stopid":282},{"id":2089,"tripid":54,"departure":{"date":"2012-08-28 14:26:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Flon","stopid":283},{"id":2090,"tripid":54,"departure":{"date":"2012-08-28 14:28:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Gruvgubben","stopid":284},{"id":2091,"tripid":54,"departure":{"date":"2012-08-28 14:29:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Macken","stopid":285},{"id":2092,"tripid":54,"departure":{"date":"2012-08-28 14:29:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Bj\u00f6rkliden","stopid":286},{"id":2093,"tripid":54,"departure":{"date":"2012-08-28 14:35:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Bruksvallarna, ICA Stigmyhrs","stopid":287},{"id":2094,"tripid":54,"departure":{"date":"2012-08-28 14:55:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Ramundberget","stopid":288}]]';

            ListDepartures(tmp_result);

            /* // Just temp removed
            var tmp_error = '';
            
            // Validation
            if (traveldata.from.id == '') {
                tmp_error = tmp_error + 'You must choose a departure bus stop. ';
            }
            
            if (traveldata.to.id == '') {
                tmp_error = tmp_error + 'You must choose a destination bus stop. ';
            }
            
            if (traveldata.from.id == traveldata.to.id) {
                tmp_error = tmp_error + 'You cant travel from and to the same bus stop. ';
            }
            
            if (!traveldata.date.string) {
                tmp_error = tmp_error + 'You must choose a departure date. ';
            }

            if (tmp_error == '') {
                var path = traveldata.from.id + '/' + traveldata.to.id + '/' + traveldata.date.string + '.json';
                alert(path);
                Ti.API.info(path);
                Data.getDepartures(path, ListDepartures);
            } else {
                Ti.API.info('Nooo!! Validation failed! ' + tmp_error);
                alert(tmp_error);
            }
            */
        });
        
        mapPopUp.setRightNavButton(searchBtn);
        
        saveToCalendarBtn = Ti.UI.createButtonBar({
            labels: [L('save2calendar_btn','Save 2 Calendar')]
        });
        saveToCalendarBtn.addEventListener('click', function(e){
            //Save it!
            alert('SAVING!');
        });

        backBtn = Titanium.UI.createButton({
            systemButton:Ti.UI.iPhone.SystemButton.CANCEL
        });
        backBtn.addEventListener('click', function(e){
            goBack();
        });

        closeBtn = Titanium.UI.createButton({
            systemButton:Ti.UI.iPhone.SystemButton.CANCEL
        });
        closeBtn.addEventListener('click', function(e){
            mapPopUp.close();
        });
        mapPopUp.setLeftNavButton(closeBtn);
        
        mapResultsView = Titanium.UI.createTableView({
            width: 300,
            height: 130,
            top: 30,
            borderColor: "#ccc",
            borderRadius: 10,
            borderWidth: 1,
        });

        
        g = {
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%'},
            colors: [{color: '#fff', offset: 0.0}, {color: '#fff', offset: 1.0}]
        };
        g_selected = {
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%'},
            colors: [{color: '#618be6', offset: 0.0}, {color: '#2462de', offset: 1.0}]
        };
        
        mapResultsView.appendRow({id: 'from', title: 'From: ', picker: picker_stop, from: true, color: '#000', cureent: null});
        mapResultsView.appendRow({id: 'to', title: 'To: ', picker: picker_stop, from: false, color: '#000', cureent: null});
        mapResultsView.appendRow({id: 'when', title: 'Date: ' + travelTime, picker: picker_date, from: false, color: '#000', current: null});

        mapResultsView.addEventListener('click', function(e){
            
            var _rowData = mapResultsView.data[0].rows;
            
            Ti.API.info('current: ' + this.current);
            
            for ( var x in _rowData){
                _rowData[x].backgroundColor = '#fff';
                _rowData[x].color = '#000';
            }

            /* change color to the "isch" focus */
            this.color = '#fff';
            this.backgroundColor = '#ccc';
           
            
            // just hide them both, and the show the one we want l8ter
            picker_stop.visible = false;
            picker_date.visible = false;
            
            // Animates the picker to scroll to the current value for the selected button
            e.row.picker.setSelectedRow(0, this.current);

            e.row.picker.visible = true;
            picker_view.visible = true;
            
            tmpStopBtn = this;
        });
        
        mapView.addEventListener('click',function(evt){
            var annotation = evt.annotation;
            var title = evt.title;
            var aid = annotation.id;
            var clickSource = evt.clicksource;
            
            if (clickSource == 'rightButton'){
                
                mapPopUp.title = title;
                // OLD
                travelFromStopBtn = aid;
                
                // NEW
                traveldata.from.id = aid;
                traveldata.from.title = title;

                var _rowData = stopsData;
                
                for ( var x in _rowData) {
                    Ti.API.info( _rowData[x].title );
                    if (title == _rowData[x].title) {
                        mapResultsView.data[0].rows[0].current = x;
                        break;
                    }

                }
                Ti.API.info('current: ' + this.current);


                mapResultsView.data[0].rows[0].title = 'From: ' + title;
                
                mapPopUp.open();
             }
             
        });

        var stopsData = [];
        Ti.API.info('numStops: ' + stops.length);
        for (var i=0;i<stops.length;i++){
            //Ti.API.info(stops[i].title + '/');

            stopsData[i] = Ti.UI.createPickerRow({id: stops[i].id, title: stops[i].title});

            var annotation = Titanium.Map.createAnnotation({
                latitude: stops[i].longitude,
                longitude: stops[i].latitude,
                title: stops[i].title,
                subtitle: L('map_annotation_more','Click for more options'),
                pincolor: Titanium.Map.ANNOTATION_GREEN,
                rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
                animate: true,
                id: stops[i].id
            });
            mapView.addAnnotation(annotation);
        }
        
        Ti.API.info('routes typeof: ' + typeof(routes));
        /*
        for (var i=0; i< routes.routes.length; i++){

            Ti.API.info('Routes ' + i);

            var locations = new Array();
            for (var u=0;u<routes.routes[i].locations.length;u++){
                //Ti.API.info('ll ' + u);
                var location = {latitude: routes.routes[i].locations[u].lon, longitude: routes.routes[i].locations[u].lat};
                locations[u] = location;
            }

            //Ti.API.info(locations.length);

            var route = {
                name: routes.stops[i].name,
                points: locations,
                color: "#bd2716",
                width: 4,
                id: routes.stops[i].id
            };
            
            Ti.API.info(route.name);

            mapView.addRoute(route);
        }
        */
        picker_stop.add(stopsData);

        mapPopUp.add(mapResultsView);
        mapPopUp.add(picker_view);


    }

    function Window(){

        mainWindow = Titanium.UI.createView({
            id: 'map'
        });
       
        /**
         * Just a temp thing...
         * so we can decide when to start loading data
         */
        loadingLabel = Titanium.UI.createLabel({
            color:'#999',
            text:'Loading...',
            font:{fontSize:20,fontFamily:'Helvetica Neue'},
            textAlign:'center',
            width:'auto'
        });
        
        mapView = Map.view;
        
        mainWindow.add(mapView);

        Ti.Geolocation.purpose = "By accepting you can find the closest skibus stop to your location!";
        
        if (Ti.Geolocation.locationServicesEnabled) {    
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 5;
            //Ti.Geolocation.purpose = "Testing";
            Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

            Ti.Geolocation.getCurrentPosition(function(e) {
                if (e.error) {
                    Ti.API.error('geo - current position' + e.error);
                    return;
                } else {
                    var currentRegion = {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude,
                        animate:true,
                        latitudeDelta:0.4,
                        longitudeDelta:0.4
                    };

                    mapView.setLocation(currentRegion); 
                }

            });
        } else {
            Ti.API.error('geo turned off');
        }

        // Ask for the Routes
        Data.getRoutes(PopulateRoutes);
        
        return mainWindow;
    }

    exports.Window = Window;

})();
