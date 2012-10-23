//(function(){
    

    /**
     *
     */
    /*
    function inits(){
        
        Ti.API.info('iniPopUp()');
        
        searchView = Titanium.UI.createView({
            // Check the other views
        });

        searchResultsWindow = Titanium.UI.createWindow({
            modal: true,
            fullscreen: true,
            width: '100%',
            height: '100%',
        });
       
    */ 

    /**
     * Class and Constructor
     */
    function Search() {
        
        Date = require('/app/lib/date').Date;
        
        // View and UI elements
        this.searchView, this.mapPopUp, this.mapResultsView, this.ttv, this.timeTableView, this.timeTablePopUp;
        this.picker_view, this.picker_date, this.picker_stop, this.searchBtn;
        
        // Data stuff
        this.stops;
        
        this.travelTime, this.todayDate, this.maxDate;
        this.tmpStopBtn;

        this.traveldata = {
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
        
        this.searchView = Ti.UI.createView({});
        
        // Get the stops!
        var that = this;
        this.Data.getStops(function(stops){that.SaveStops(stops)});
    }

    var DataObj = require('/app/lib/data').Data;
    Search.prototype.Data = new DataObj();
     
    var ATCObj = require('/app/lib/addToCalendar');
    Search.prototype.ATC = new ATCObj();
    
    Search.prototype.getView = function() {
        return this.searchView;
    }

    Search.prototype.InitializeSearchView = function() {
        Ti.API.info("Initalize");
        
        var that = this;
/*        
        g = {
            type: 'linear',
            startPoint: { x: '0%', y: '0%' },
            endPoint: { x: '0%', y: '100%'},
            colors: [{color: '#fff', offset: 0.0}, {color: '#dcdcff', offset: 1.0}]
        };

        var bar = Titanium.UI.createView({
                top: 0,
                height: 30,
                width: '100%',
                backgroundGradient: g
            });
*/      
        // Create the view to hold the picker (+ toolbar)
        this.picker_view = Titanium.UI.createView({
            height: 251, //251,231
            bottom: 0,
            zIndex: 3,
            visible: true
        });

//      this.picker_view.add(bar);
        
        //searchBtn = Ti.UI.createButtonBar({
        //    labels: [L('search_btn','Search')],
        //});

        //this.picker_view.setNabBarHidden(false);
        //this.picker_view.setRightNavButton(bar);
        //Ti.API.info('isNavHidden? ' + this.picker_view.getNavBarHidden());

        // Get todays data
        this.todayDate = new Date.today();
        this.travelTime = this.todayDate.toString('yyyy-MM-dd');
        
        this.traveldata.date.raw = this.todayDate;
        this.traveldata.date.string = this.todayDate.toString('yyyy-MM-dd');
        
        // Max date should be set to the last date the bus acctualy runs this season!
        this.maxDate = new Date.today().set({month: 3}).moveToLastDayOfMonth();

        // Create the picker for departure date
        this.picker_date = Ti.UI.createPicker({
            type: Ti.UI.PICKER_TYPE_DATE,
            //minDate: this.todayDate,
            minDate: new Date(2010,0,1),
            maxDate: this.maxDate,
            value: this.todayDate,
            visible: false,
            selectionIndicator: true,
            bottom: 0
        });
        this.picker_date.addEventListener('change', function(e){
            Ti.API.info(e.value);
            var tmpDate = e.value.getFullYear() + '-' + (e.value.getMonth()+1) + '-' + e.value.getDate();
            var goodDate = new Date.parse(tmpDate);
            that.tmpStopBtn.title = 'On: ' + goodDate.toString('yyyy-MM-dd');
            that.travelTime = goodDate.toString('yyyy-MM-dd');
            
            that.traveldata.date.raw = goodDate;
            that.traveldata.date.string = goodDate.toString('yyyy-MM-dd');
            
        });
        
        // Create the picker for stops, they both use the same picker
        this.picker_stop = Ti.UI.createPicker({selectionIndicator: true, visible: false, bottom: 0});
        
        this.picker_stop.addEventListener('change', function(e){
            Ti.API.info(e.row.id + '/' + e.rowIndex + '/' + e.row.title);
            
            that.tmpStopBtn.current = e.rowIndex;

            // Check if its from/to
            if (that.tmpStopBtn.from){
                that.tmpStopBtn.title = 'From: ' + e.row.title;

                that.traveldata.from.title = e.row.title;
                that.traveldata.from.id = e.row.id;
            } else {
    Ti.API.info(DataObj);
                that.tmpStopBtn.title = 'To: ' + e.row.title;

                that.traveldata.to.title = e.row.title;
                that.traveldata.to.id = e.row.id;
            }
        });

        // Add pickers to the picker view
        this.picker_view.add(this.picker_date);
        this.picker_view.add(this.picker_stop);
        
        // The traveldata collector view
        this.travelDataCollectorView = Titanium.UI.createTableView({
            width: 300,
            height: 130,
            top: 30,
            borderColor: "#ccc",
            borderRadius: 10,
            borderWidth: 1,
        });
        
        // Add the from, to, and date buttons
        this.travelDataCollectorView.appendRow({id: 'from', title: 'From: ', picker: this.picker_stop, from: true, color: '#000', cureent: null});
        this.travelDataCollectorView.appendRow({id: 'to', title: 'To: ', picker: this.picker_stop, from: false, color: '#000', cureent: null});
        this.travelDataCollectorView.appendRow({id: 'when', title: 'Date: ' + this.travelTime, picker: this.picker_date, from: false, color: '#000', current: null});
        
        this.travelDataCollectorView.addEventListener('click', function(e){
            
            var _rowData = that.travelDataCollectorView.data[0].rows;
            for ( var x in _rowData){
                _rowData[x].backgroundColor = '#fff';
                _rowData[x].color = '#000';
            }

            // change color to the "isch" focus
            this.color = '#fff';
            this.backgroundColor = '#ccc';
            
            // just hide them both, and the show the one we want l8ter
            that.picker_stop.visible = false;
            that.picker_date.visible = false;
            
            // Animates the picker to scroll to the current value for the selected button
            e.row.picker.setSelectedRow(0, this.current);

            e.row.picker.visible = true;
            that.picker_view.visible = true;
            
            that.tmpStopBtn = this;
        });
        
        var stopsData = [];
        Ti.API.info('numStops: ' + this.stops.length);
        for (var i=0;i<this.stops.length;i++){
            stopsData[i] = Ti.UI.createPickerRow({id: this.stops[i].id, title: this.stops[i].title});
        }
        
        this.picker_stop.add(stopsData);
        
        // Add the search btn
        this.searchBtn = Ti.UI.createButton({
            title: "sök",
            top: 170,
            left: 10});

        this.searchBtn.addEventListener('click', function(e) {

            // This is just so we can have something to work with while there are no skibusses
            var tmp_result = '[[{"id":2035,"tripid":53,"departure":{"date":"2012-08-28 08:40:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalens Bussplan","stopid":264},{"id":2036,"tripid":53,"departure":{"date":"2012-08-28 08:43:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalsberget","stopid":281},{"id":2037,"tripid":53,"departure":{"date":"2012-08-28 08:45:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Fun\u00e4sdalens Fj\u00e4llkamping","stopid":282},{"id":2038,"tripid":53,"departure":{"date":"2012-08-28 08:51:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Flon","stopid":283},{"id":2039,"tripid":53,"departure":{"date":"2012-08-28 08:53:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Gruvgubben","stopid":284},{"id":2040,"tripid":53,"departure":{"date":"2012-08-28 08:54:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Macken","stopid":285},{"id":2041,"tripid":53,"departure":{"date":"2012-08-28 08:54:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Bj\u00f6rkliden","stopid":286},{"id":2042,"tripid":53,"departure":{"date":"2012-08-28 08:55:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Bruksvallarna, ICA Stigmyhrs","stopid":287},{"id":2043,"tripid":53,"departure":{"date":"2012-08-28 09:10:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 1","stop":"Ramundberget","stopid":288}],[{"id":2086,"tripid":54,"departure":{"date":"2012-08-28 14:15:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalens Bussplan","stopid":264},{"id":2087,"tripid":54,"departure":{"date":"2012-08-28 14:18:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalsberget","stopid":281},{"id":2088,"tripid":54,"departure":{"date":"2012-08-28 14:20:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Fun\u00e4sdalens Fj\u00e4llkamping","stopid":282},{"id":2089,"tripid":54,"departure":{"date":"2012-08-28 14:26:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Flon","stopid":283},{"id":2090,"tripid":54,"departure":{"date":"2012-08-28 14:28:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Gruvgubben","stopid":284},{"id":2091,"tripid":54,"departure":{"date":"2012-08-28 14:29:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Macken","stopid":285},{"id":2092,"tripid":54,"departure":{"date":"2012-08-28 14:29:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Bj\u00f6rkliden","stopid":286},{"id":2093,"tripid":54,"departure":{"date":"2012-08-28 14:35:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Bruksvallarna, ICA Stigmyhrs","stopid":287},{"id":2094,"tripid":54,"departure":{"date":"2012-08-28 14:55:00","timezone_type":3,"timezone":"Europe\/Berlin"},"line":"Linje 4","stop":"Ramundberget","stopid":288}]]';

            var that = this;
            that.ListDepartures(tmp_result);

        });
        this.searchView.add(this.searchBtn);


        this.searchView.add(this.travelDataCollectorView);
        this.searchView.add(this.picker_view);
        
    }

    Search.prototype.SaveStops = function(_stops){
        var resources = eval( '(' + _stops + ')' );
        this.stops = resources;
        
        // Maybe use events or something... maybe not
        this.InitializeSearchView();
    }

    /**
     * Callback for creating a timetable of the possible departure dates
     */
    Search.prototype.ListDepartures = function(_results){

        var results = eval('('+_results+')');
        Ti.API.info(results);
        /*
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
                    right: 10,
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
                        right: 10,
                        height: 12
                    });
                    subRow.add(destinationTimeLabel);

                    row = subRow;
                }               

                if (true == within) {
                    subdata.push(subRow);
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
            data.push(row);
        }

        timeTableView.setData(data);

        timeTableView.addEventListener('click', function(e){
            
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
        
        });

        mapPopUp.setLeftNavButton(backBtn);
        mapPopUp.setRightNavButton(saveToCalendarBtn);

        // Hide the current views
        picker_view.hide();
        
        // Show timetable
        mapPopUp.add(timeTableView);
        */
    }

    module.exports = Search;
