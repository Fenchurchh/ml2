exports.shows = {
    print: function(doc, req) {
      if (!doc) {
        return "<h1>hello</h1>";
      } else {
        ret   = "<h1>hello " + doc.username + "</h1>";
        ret  += "<p>Your document is called '" + doc._id + "' and it is a '" + doc.type + "'.</p>";
        return ret;
      }
    }
  };

  
exports.rewrites = [
  {
    "from": "/",
    "to": "index.html"
  },
  {
    "from": "/print/*",
    "to": "_show/print/*"
  }
];
