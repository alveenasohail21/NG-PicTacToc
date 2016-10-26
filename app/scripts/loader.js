/*
 * Name: eventChannel.js
 * Purpose: Library to handle custom events, this will be bind to window.eventChannel
 * Example Usage:
 * --------------
 * Call through -> window.eventChannel OR eventChannel
 * --------------
 * Register Event
 * eventChannel.on('eventName', callbackFunction );
 * --------------
 * Fire Event
 * eventChannel.fire('eventName');
 * --------------
 * Unregister All Callback of a Particular Event
 * eventChannel.off('eventName');
 * */


// class details
function GlobalLoader(){

}

// prototype functions
GlobalLoader.prototype = {
    constructor: GlobalLoader,
    show: function() {
        $('.global-loader').css('display', 'block');
    },
    hide:function(){
        $('.global-loader').css('display', 'none');
    }
};

// bind eventChannel instance to window (for global usage)
window.globalLoader = new GlobalLoader();