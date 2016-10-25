function EventChannel(){
  this.list = {};
}

EventChannel.prototype = {

  constructor: EventChannel,

  on: function(name, callback) {

    if(!this.list[name])
      this.list[name] = [];

    this.list[name].push({callback:callback});

  },

  off:function(name){
    if(this.list[name])
      delete this.list[name];
  },

  fire: function(name){

    for(var i in this.list){

      if(i === name) {
        var details = {
          name: '',
          data: null
        };
        var args = Array.prototype.slice.call(arguments);
        details.name = args[0];
        args.splice(0, 1);
        details.data = args;
        for(var j=0; j< this.list[name].length; j++) {
          this.list[name][j].callback.apply(this, [details]);
        }
      }
    }
  },

  has: function(name){

    return (name in this.list);

  }

};

// bind eventChannel instance to window (for global usage)
window.eventChannel = new EventChannel();
