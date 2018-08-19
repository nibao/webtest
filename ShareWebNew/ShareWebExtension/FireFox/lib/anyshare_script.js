self.port.on("getCookie",function(data){
    self.port.emit("backCookie",document.cookie);
});