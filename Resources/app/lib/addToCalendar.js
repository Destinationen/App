/**
 * This should be renamed to something like "addReminder"
 */
function addToCalendar() {
    Ti.API.info("addToCalendar");
    
    Date = require('/app/lib/date').Date;

    this.view;
    this.submitBtn;
    
    var a2c = this;

    this.view = Ti.UI.createView({
        backgroundColor: 'black'
    });
    
    this.submitBtn10min = Ti.UI.createButton({
        title: "10 min",
        top: 100
    });
    this.submitBtn10min.addEventListener('click', function(e){
        a2c.addEvent();
    });
    this.view.add(this.submitBtn10min);
}

addToCalendar.prototype.getView = function() {
    return this.view;
}

/**
 * Communicate with the calendar module and save the event
 */
addToCalendar.prototype.addEvent = function(when) {
    Ti.API.info("addEvent");

    if (platform == 'ios') {
        Ti.API.info("add to calendar ios");
    } else {
        Ti.API.info("add to calendar android");
    }

    this.view.hide();
}

/**
 * Use background service as alarm
 */
addToCalendar.prototype.bgAlarm = function(minutes) {
    Ti.API.info("submit");

    if (platform == 'ios') {
        alert("Send me to background and I will popup when its time to go!");
        // If we fail to add to calendar, then add it as a backgroundservice maybe?
        var service = Ti.App.iOS.registerBackgroundService({
            url:'bg.js'
        });
    } else {
        Ti.API.info("Att background service andorid");
    }

}
module.exports = addToCalendar;
