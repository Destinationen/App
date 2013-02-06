// Not used right now
var date = new Date();
var notification = Ti.App.iOS.scheduleLocalNotification({
    alertBody:"Its time to go!",
    alertAction:"Re-Launch!",
    userInfo:{"hello":"world"},
    date:new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
});
