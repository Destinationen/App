(function(){
    
    function Data(){
       
        /*
        var setDate = function(date){
            this.Date = date;
        }
        */
        
        Date = require('/app/lib/date').Date;

        /**
         *  
         */
        //include('date-sv-SE');
        //var DateObj = require('date-sv-SE');
        //var Date = DateObj.Date;

        /**
         * This should at some point be changed to the live url
         */
        var baseUrl = 'http://reseguide.amy.chas.se/api/';
        
        /**
         * For some reason it seems to fail to look in, and creating files directly in a "cache" folder
         */
        //var cache_dir = Titanium.Filesystem.getFile( Titanium.Filesystem.applicationDataDirectory );
        var cache_dir = Titanium.Filesystem.applicationDataDirectory;
        /**
         * Get Data, from local device Cache if exists and has not expired. Else
         * get fresh data from server.
         * 
         * @param   fileName    Path and file name of the content we want from the API
         * @param   callback    Where to send tha data when we get it
         */
        var getData = function(fileName, callback){
            Ti.API.info('Data.getData()');

           
            var useCache = false;

            var f = Ti.Filesystem.getFile( cache_dir, fileName );

            if (f.exists() === true){
                
 
                var create_ts = f.createTimestamp();
                var mod_ts = f.modificationTimestamp();

                var experationdate = new Date.today().add(-2).days();
                //var today = Date.today();
                
                var timestamp_date = new Date(mod_ts);
                var timestamp_string = timestamp_date.getFullYear() + "-" + timestamp_date.getMonth() + "-" + timestamp_date.getDate();
                var timestamp = new Date.parse(timestamp_string);
                
                Ti.API.info('timestamp: ' + mod_ts);
                Ti.API.info('experationdate: ' + experationdate.getTime());
                
                Ti.API.info('The file was last Modified "'+ timestamp.toString('yyyy-MM-dd') + '"');
                Ti.API.info('Experationdate "'+ experationdate.toString('yyyy-MM-dd') +'"');
                
                Ti.API.info('Cache content is "' + (experationdate < mod_ts ? 'fresh' : 'old') + '"');
                

                if (experationdate < mod_ts){
                    
                    Ti.API.info('and the if is on track!');

                    useCache = true;
                }


            }

            if (useCache == false){
                Ti.API.info('The file "' + fileName + '" does not exist or is not up to date.');

                // Start loading the remote data from our API
                getRemoteData(fileName, callback);

            } else {

                Ti.API.info('All is well and we have cached data');

                var contents = f.read();
                var ending = fileName.substring(fileName.length, fileName.length-4); 
                /*
                if (ending == 'json' && contents.length > 0){
                    contents = JSON.parse(f.read());
                }
                */
                Ti.API.info('contents: ' + contents);
                callback(contents);
            }

        }
        
        /**
         * Write stuff to the local device cache as a text file
         * 
         * @param   fileName    Path and file name of the content we wanted
         * @param   content     What we probably got from the API and want to save 
         */
        var writeCache = function(fileName, content, callback){
            Ti.API.info('Data.writeCache("'+fileName+'", content)');
            Ti.API.info('cache_dir: ' + cache_dir);
            Ti.API.info('content: ' + content);

            var f = Ti.Filesystem.getFile(cache_dir, fileName);
            
            f.write(content);

            //f.move('cache/' + fileName);

            callback(content);
            //getData(fileName, callback);
        }
        
        /**
         * Get the Route JSON object
         *
         * @param   callback    Where to send the routes
         */
        this.getRoutes = function(callback){
            Ti.API.info('Data.getRoutes(callback)');
            getData('routes.json', callback);
        }
        
        /**
         *
         */
        this.getPages = function(callback){
            Ti.API.info('Data.getPages(callback)');
            getData('page.json', callback);
        }

        /**
         * Get Data from the server, save it to the local device cache,
         * and return the stuff by calling getData again.
         *
         * @param   fileName    The path and file name of the content we want from the API
         * @param   callback    Pass on this one back to getData, as well as the fileName...
         */
        var getRemoteData = function(fileName, callback){
            Ti.API.info('Data.getRemoteData()');
            
            
            var url = baseUrl + fileName;

            var xhr = Ti.Network.createHTTPClient({
                onload: function(e) {
                    //Ti.API.debug(this.responseText);
                    Ti.API.info('API communication successful');

                    var response = this.responseText;
                    writeCache(fileName, response, callback);
                    
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
