// Not used right now
var date = new Date();
var notification = Ti.App.iOS.scheduleLocalNotification({
    alertBody:"Kitchen Sink was put in background",
    alertAction:"Re-Launch!",
    userInfo:{"hello":"world"},
    sound:"pop.caf",
    date:new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
});
