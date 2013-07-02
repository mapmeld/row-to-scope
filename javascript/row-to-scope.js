// get CSV data
$.get("../data/data.csv", function(data){
  var rows = $.csv.toArrays(data);

  // get key and current page
  var keyrow = rows[ 0 ];
  var myrow = rows[ Math.max(0, 1 * (getURLVar("page") || getURLVar("row")) - 1) ];
  var mypageurl = (getURLVar("page") || getURLVar("row"));
  
  for(var i=0;i<keyrow.length;i++){
    document.title = replaceAll( document.title, keyrow[i], myrow[i] );
    $(document.body).html( replaceAll( $(document.body).html(), keyrow[i], myrow[i] ) ); 
  }

  // make page visible
  $(document.body).css({ visibility: "visible" });

  // replace jQuery html with one which replaces row
  Function.prototype.clone = function() {
      var cloneObj = this;
      if(this.__isClone) {
        cloneObj = this.__clonedFrom;
      }

      var temp = function() { return cloneObj.apply(this, arguments); };
      for(var key in this) {
        temp[key] = this[key];
      }

      temp.__isClone = true;
      temp.__clonedFrom = cloneObj;

      return temp;
  };
  $.fn.oldhtml = $.fn.html.clone();
  $.fn.html = function(){
    for(var a=0;a<arguments.length;a++){
      for(var i=0;i<keyrow.length;i++){
        arguments[a] = replaceAll( arguments[a], keyrow[i], myrow[i] ); 
      }
    }
    return $.fn.oldhtml.apply(this, arguments);
  };
  
  // offer helper function to replace values with this row's values
  replaceRow = function(arg){
    if(typeof arg == "number"){
      // replace with fitting numbers
      for(var i=0;i<keyrow.length;i++){
        if(keyrow[i] * 1 === arg){
          return myrow[i] * 1;
        }
      }
    }
    else if(typeof arg == "object" && arg.length){
      // assume an array; replace each element
      for(var i=0;i<arg.length;i++){
        arg[i] = replaceRow(arg[i]);
      }
      return arg;
    }
    else if(typeof arg == "object"){
      // replace with fitting object
      for(var i=0;i<keyrow.length;i++){
        try{
          if(JSON.parse(keyrow[i]) && JSON.parse(keyrow[i]) == arg){
            return JSON.parse(myrow[i]);
          }
        }
        catch(e){
        }
      }
    }
    else{
      // replace with fitting string
      for(var i=0;i<keyrow.length;i++){
        return replaceAll(arg, keyrow[i], myrow[i]);
      }
    }
  };
  
  next = function(){
    if(mypageurl < rows.length){
      window.location = (window.location+"").replace("page=" + mypageurl, "page=" + (mypageurl * 1 + 1)).replace("row=" + mypageurl, "row=" + (mypageurl * 1 + 1));
    }
  };

  previous = function(){
    if(mypageurl > 0){
      window.location = (window.location+"").replace("page=" + mypageurl, "page=" + (mypageurl * 1 - 1)).replace("row=" + mypageurl, "row=" + (mypageurl * 1 - 1));
    }
  };
  
  first = function(){
    window.location = "?page=1";
  };
  
  last = function(){
    window.location = "?page=" + rows.length;
  };
  
  if(typeof init == "function"){
    init();
  }
});

// placeholders for JS helper functions
var replaceRow, next, previous, first, last;

function replaceAll(src, oldr, newr){
  if(newr.indexOf(oldr) > -1){
    return src;
  }
  while(src.indexOf(oldr) > -1){
    src = src.replace(oldr, newr);
  }
  return src;
}

function getURLVar(nm){nm=nm.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var rxS="[\\?&]"+nm+"=([^&#]*)";var rx=new RegExp(rxS);var rs=rx.exec(window.location.href);if(!rs){return null;}else{return rs[1];}}