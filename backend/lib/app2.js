exports = {
  show: {
    print: function(doc, req) {
      return "<h1>hello</h1>";
    }
  },
  views: {
    by_date: {
        map: function (doc) {
          if(doc.type == 'inserat' && doc.meta && doc.meta.created) {
            emit(doc.meta.created, doc);
          }
        }
    }
  },
  updates : {
    touch: function( doc, req ) {

      if (!doc) { return [null, "no doc"];}
      
      doc.meta = {
        created : (new Date()).valueOf(),
        state   : "new",
        unchecked: [],
        checked: []
      }
      return [doc, "touched doc."];    

    }
  }  
}