function Queue() {
  this.queue = [];
}

Queue.prototype.enqueue = function(value) {
  this.queue.push(value);
};
Queue.prototype.dequeue = function() {
  return this.queue.shift();
};
Queue.prototype.peek = function() {
  if(this.queue.length>0){
    return this.queue[0];
  }
  else{
    return null;
  }
};
Queue.prototype.length = function() {
  return this.queue.length;
};
Queue.prototype.print = function() {
  console.log(this.queue.join(' '));
};

Queue.prototype.isEmpty = function(){
  return !(this.queue.length>0);
};