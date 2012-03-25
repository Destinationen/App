(function() {

    var mainWindow;
    var mapPopUp, annotationInfo, mapResultsView, timeTableView, timeTablePopUp;
    var picker_view, picker_date, picker_stop;
    var mapView;
    var loadingLabel;
    
    var tmpStopBtn, saveToCalendarBtn, closeBtn, searchBtn, backBtn;
    var travelFromStopBtn, travelToStopBtn;
    var travelTime;
    
    var g;
    var g_selected;

    var stops, routes;

    var DataObj = require('/app/lib/Data').Data;
    this.Data = new DataObj();

    var MapObj = require('/app/lib/Map').Map;    
    this.Map = new MapObj();
    
    Date = require('/app/lib/date').Date;
    
    /**
     * Callback for saving the stops for l8ter use in travelplans
     */
    var SaveStops = function(_stops){
        Ti.API.info('Saving Stops! ' + _stops);
        var resources = eval( '(' + _stops + ')' );
        
        stops = resources;

        // I think this will be enough, otherwise we have to create some queue
        initPopUp();

        //Data.getRoutes(PopulateRoutes);
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

        timeTableView = Ti.UI.createTableView({
            style:Titanium.UI.iPhone.TableViewStyle.GROUPED
        });
        var data = new Array();
        var numTrips = results.length;
        
        // No trips that day, to bad
        if (numTrips == 0){
            alert('Sorry There are no trips this day, between these stops.');
            return false;
        }
        
        
        for (var t=0;t<numTrips;t++){
            var numRows = results[t].length;
            
            var rowId = results[t][0].stopid;
            var rowLineId = results[t][0].tripId;
            var rowName = results[t][0].stop;
            var rowLine = results[t][0].line;
            var rowDeparture = results[t][0].departure;
            
            var titleLabel = Ti.UI.createLabel({
                text: rowName,
                font: {fontSize:16, fontWeight: 'bold'},
                width: 'auto',
                textAlign: 'left',
                top: 10,
                left: 10,
                height: 16
            });

            var timeLabel = Ti.UI.createLabel({
                text: rowDeparture.date,
                font: {fontSize:12, fontWeight: 'bold'},
                width: 'auto',
                textAlign: 'right',
                top: 11,
                right: 10,
                height: 12
            });
            
            
            var row = new Object();
            row.isParent = true;
            row.opened = false;
            row.title = rowName + ' ' + new Date.parse(rowDeparture.date).toString("HH:mm")
            //row.add(titleLabel);
            //row.add(timeLabel);
            //row.hasChildren=true;
            row.className = 'TimeTableRowParent';
            //data.push(row);
            
            // Create a subtableview for the stops
            //var tmpSubList = Ti.UI.createTableView();
            var subdata = new Array();

            for (var r=1;r<numRows;r++){
                Ti.API.info('  ' + results[t][r].stop);
                
                var subRowId = results[t][r].stopid;
                var subRowLineId = results[t][r].tripId;
                var subRowName = results[t][r].stop;
                var subRowLine = results[t][r].line;
                var subRowDeparture = results[t][r].departure;
                
                
                var subTitleLabel = Ti.UI.createLabel({
                    text: subRowName,
                    font: {fontSize:16, fontWeight: 'bold'},
                    width: 'auto',
                    textAlign: 'left',
                    top: 10,
                    left: 10,
                    height: 16
                });

                var subTimeLabel = Ti.UI.createLabel({
                    text: new Date.parse(subRowDeparture.date).toString("HH:mm"),
                    font: {fontSize:12, fontWeight: 'bold'},
                    width: 'auto',
                    textAlign: 'right',
                    top: 11,
                    right: 10,
                    height: 12
                });
                
                var subRow = Ti.UI.createTableViewRow();
                subRow.backgroundColor = "#f5f5f5";
                //var subRow = Ti.UI.createView();
                //var subRow = new Object();
                //subRow.title = 'hej';
                //subRow.title = subRowName;
                subRow.add(subTitleLabel);
                subRow.add(subTimeLabel);
                
                subRow.hasChildren=false;
                subRow.className = 'TimeTableSubRow';
                subdata.push(subRow);
            }
            //tmpSubList.setDate(subdata);
            row.sub = subdata;
            //row.add(tmpSubList);
            data.push(row);
            
        }

        /*
        data.push({
                title: "Parent 1",
                isParent: true,
                opened: false,
                sub: []
            });
        */
        /*
        data.push({
                title: "Parent 2",
                isParent: true,
                opened: false,
                sub: [
                    {
                        title: "Child 3"
                    },
                    {
                        title: "Child 4"
                    }
                    ]
           });    
        */

        Ti.API.info(data);
        timeTableView.setData(data);
        //timeTablePopUp.add(timeTableView);
        //var tmp_label = Ti.UI.createLabel({text: 'test', top: 10, left: 10});
        //timeTablePopUp.add(timeTableView);
        //mapPopUp.animate({window: timeTablePopUp, transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });
        //timeTablePopUp.open();
        //mapPopUp.hide();
       

        timeTableView.addEventListener('click', function(e){
            
            if (e.row.isParent){
                
                var currentIndex = e.index;
                Ti.API.info('currentIndex: ' + currentIndex);
                Ti.API.info('e.row.opened: ' + e.row.opened);

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
        
        });



        // Switch Search Btn to Save Btn
        //searchBtn.hide();
        //saveToCalendarBtn.show();

        // Switch Back to map Btn to... Back to search Btn
        //closeBtn.hide();
        //backBtn.show();

        mapPopUp.setLeftNavButton(backBtn);
        mapPopUp.setRightNavButton(saveToCalendarBtn);

        // Hide the current views
        picker_view.hide();


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
        //Ti.API.info( resources );
        
        // Routesa
        /*
        for (var i=0; i< resources.routes.length; i++){

            Ti.API.info('Routes');

            var locations = new Array();
            for (var u=0;u<resources.routes[i].locations.length;u++){
                //Ti.API.info('ll ' + u);
                var location = {latitude: resources.routes[i].locations[u].lon, longitude: resources.routes[i].locations[u].lat};
                locations[u] = location;
            }

            Ti.API.info(locations.length);

            var route = {
                name: resources.stops[i].name,
                points: locations,
                color: "#bd2716",
                width: 4,
                id: resources.stops[i].id
            };
            
            Ti.API.info(route.name);

            mapView.addRoute(route);
        }
        */
        //Ti.API.info('Added Map Annotations & Routes');

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
            text: 'This is just a test, fill this one with info about the annotation, susch as lat,lon.',
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
        var maxDate = new Date.today().set({month: 3}).moveToLastDayOfMonth();

        picker_date = Ti.UI.createPicker({
            type: Ti.UI.PICKER_TYPE_DATE,
            minDate: todayDate,
            maxDate: maxDate,
            value: todayDate,
            visible: false,
            selectionIndicator: true,
            bottom: 0
        });
        picker_stop = Ti.UI.createPicker({selectionIndicator: true, visible: false, bottom: 0});
        
        picker_stop.addEventListener('change', function(e){
            Ti.API.info(e.row.id + '/' + e.rowIndex + '/' + e.row.title);
            
            //Ti.API.info(e.selectedValue);
            
            tmpStopBtn.current = e.rowIndex;

            // Check if its from/to
            if (tmpStopBtn.from){
                travelFromStopBtn = e.row.id;
                tmpStopBtn.title = 'From: ' + e.row.title;
            } else {
                travelToStopBtn = e.row.id;
                tmpStopBtn.title = 'To: ' + e.row.title;
            }
        });
        picker_date.addEventListener('change', function(e){
            Ti.API.info(e.value);
            var tmpDate = e.value.getFullYear() + '-' + (e.value.getMonth()+1) + '-' + e.value.getDate();
            var goodDate = new Date.parse(tmpDate);
            tmpStopBtn.title = 'On: ' + goodDate.toString('yyyy-MM-dd');
            travelTime = goodDate.toString('yyyy-MM-dd');
        });
        
        picker_view.add(picker_date);
        picker_view.add(picker_stop);
 
        searchBtn = Ti.UI.createButtonBar({
            labels: [L('search_btn','Search')],
            backgroundColor: '#a58d1e'
        });
        
        searchBtn.addEventListener('click', function(e){
            var tmp_error = '';
            
            // just a test to se if the timetable is functioning
            //var path = '8/12/2012-02-15.json';
            //Data.getDepartures(path, ListDepartures);
              
            // Validation
            if (travelFromStopBtn == undefined){
                tmp_error = tmp_error + 'You must choose a departure bus stop. ';
            }

            if (travelToStopBtn == undefined){
                tmp_error = tmp_error + 'You must choose a destination bus stop. ';
            }

            if (travelFromStopBtn == travelToStopBtn){
                tmp_error = tmp_error + 'You cant travel from and to the same bus stop. ';
            }
            
            
            if (!travelTime){
                tmp_error = tmp_error + 'You must choose a departure date. ';
            }
            

            if (tmp_error == ''){
                Ti.API.info('SEARCH IT!');
                var path = travelFromStopBtn + '/' + travelToStopBtn + '/' + travelTime + '.json';
                Data.getDepartures(path, ListDepartures);
            } else {
                Ti.API.info('Nooo!! Validation failed! ' + tmp_error);
                alert(tmp_error);
            }
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
                travelFromStopBtn = aid;

                Ti.API.info('aid: ' + aid);
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
        
        Ti.API.info('typeof: ' + typeof(routes));
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


        Ti.Geolocation.purpose = "Testing";
        
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
        //Data.getStops(SaveStops);
        
        return mainWindow;
    }

    exports.Window = Window;

})();
