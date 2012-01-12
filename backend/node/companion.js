var follow = require('follow');
var opts = {}; // Same options paramters as before
var feed = new follow.Feed(opts);

feed.db            = "http://couch.vm/makellos";
feed.since         = 3;
feed.heartbeat     = 30    * 1000
feed.inactivity_ms = 86400 * 1000;

feed.filter = function(doc, req) {
  // req.query is the parameters from the _changes request and also feed.query_params.
  return (doc.type == 'inserat');
}

feed.on('change', function(change) {
  var doc = change.doc;
  
  if (doc.type == 'inserat') {
    
    console.log(change.seq + ')\tINSERAT ' + doc._id + " -- rev " + doc._rev);
    if (doc.meta)
      console.log("   \t" + doc.meta.state);
    
  } else {
    console.log(change.seq + ") " + change.id);
  }
})

feed.follow();