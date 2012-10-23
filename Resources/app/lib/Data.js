(function(){
    
    function Data(){
       
        Date = require('/app/lib/date').Date;

        /**
         * This should at some point be changed to the live url
         */
        //var baseUrl = 'http://api.funasfjallen.se/api';
        var baseUrl = 'http://reseguide.amy.chas.se/api';
        
        /**
         * For some reason it seems to fail to look in, and creating files directly in a "cache" folder
         */
        //var cache_dir = Titanium.Filesystem.getFile( Titanium.Filesystem.applicationDataDirectory );
        var cache_dir = Titanium.Filesystem.applicationDataDirectory;
        
        /**
         * Its not to happy saving files with / in the filename, so generate another name
         */
        var getLocalFileName = function(filename){
            
            var tmp = filename.replace(/\//g, '-');
            
            return tmp;
        }

        /**
         * Get Data, from local device Cache if exists and has not expired. Else
         * get fresh data from server.
         * 
         * @param   fileName    Path and file name of the content we want from the API
         * @param   callback    Where to send tha data when we get it
         */
        var getData = function(fileName, callback){

            var useCache = false;
            
            var localFileName = getLocalFileName(fileName);

            var f = Ti.Filesystem.getFile( cache_dir, localFileName );

            if (f.exists() === true){
 
                var create_ts = f.createTimestamp();
                var mod_ts = f.modificationTimestamp();

                var experationdate = new Date.today().add(-2).days();
                
                var timestamp_date = new Date(mod_ts);
                var timestamp_string = timestamp_date.getFullYear() + "-" + timestamp_date.getMonth() + "-" + timestamp_date.getDate();
                var timestamp = new Date.parse(timestamp_string);
               
                if (experationdate < mod_ts){
                    useCache = true;
                }


            }
            
            /**
             * If useCache == false then we need to get remote data
             */
            if (useCache == false){
                // Start loading the remote data from our API
                getRemoteData(fileName, callback);
            } else {
                var contents = f.read();
                var ending = fileName.substring(fileName.length, fileName.length-4); 
                /*
                if (ending == 'json' && contents.length > 0){
                    contents = JSON.parse(f.read());
                }
                */
                callCallback(callback, contents);
            }

        }
        
        /**
         * Write stuff to the local device cache as a text file
         * 
         * @param   fileName    Path and file name of the content we wanted
         * @param   content     What we probably got from the API and want to save 
         */
        var writeCache = function(fileName, content, callback){

            var f = Ti.Filesystem.getFile(cache_dir, fileName);
            
            f.write(content);

            //f.move('cache/' + fileName);
            
            callCallback(callback, content);
            //getData(fileName, callback);
        }
        
        /**
         * call the callback on one place
         */
        var callCallback = function(callback, content){

            // Fire the event that this is loaded and done
            Ti.App.fireEvent('loading.done');

            callback(content);
        }

        /**
         * Get the Route JSON object
         *
         * @param   callback    Where to send the routes
         */
        this.getRoutes = function(callback){
            getData('routes.json', callback);
        }
        
        /**
         *
         */
        this.getPages = function(callback){
            getData('page.json', callback);
        }

        /**
         *
         */
        this.getStops = function(callback){
            getData('timetable/bus/stops.json', callback);
        }
        
        /**
         *
         */
        this.getDepartures = function(path, callback){
            getData('timetable/bus/' + path, callback);
        }

        /**
         * Get Data from the server, save it to the local device cache,
         * and return the stuff by calling getData again.
         *
         * @param   fileName    The path and file name of the content we want from the API
         * @param   callback    Pass on this one back to getData, as well as the fileName...
         */
        var getRemoteData = function(fileName, callback){
            
            var url = baseUrl + fileName;

            var xhr = Ti.Network.createHTTPClient({
                onload: function(e) {

                    var response = this.responseText;
                    var localFileName = getLocalFileName(fileName);
                    writeCache(localFileName, response, callback);
                    
                    //getData(fileName, callback);
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    //alert('error');
                    getRemoteData(filename, callback);
                },
                timeout: 5000
            });

            xhr.open("GET", url);
            xhr.send();
        }
        
        
    }
    
    exports.Data = Data;

})();
