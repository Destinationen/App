function addToCalendar() {
    Ti.API.info("addToCalendar");
    
    Date = require('/app/lib/date').Date;

    this.view;
    this.submitBtn;
    
    this.view = Ti.UI.createView({
        backgroundColor: 'black'
    });
    
    this.submitBtn = Ti.UI.createButton({
        title: "10 min",
        top: 100
    });
    this.view.add(this.submitBtn);
}

addToCalendar.prototype.getView = function() {
    return this.view;
}

/**
 * Do the actual save to calendar
 */
addToCalendar.prototype.submit = function(when) {
    Ti.API.info("submit");
}

module.exports = addToCalendar;
