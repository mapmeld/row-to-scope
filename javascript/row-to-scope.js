// get CSV data
if(typeof dataSource == "undefined"){
  dataSource = "../data/data.csv";
}
if(typeof $ == "undefined"){
  alert("Include jQuery and add it before row-to-scope.js");
}
if(dataSource.toLowerCase().indexOf(".csv") > -1){
  // CSV parser
  $.get(dataSource, function(data){
    var rows = $.csv.toArrays(data);
    runRows(rows);
  });
}
else if(dataSource.toLowerCase().indexOf(".shp") > -1){
  // ZIP / SHP parser
  if(typeof shp == "undefined"){
    alert("Include shapefile-js and add it before row-to-scope.js");
  }
  shp( dataSource ).then(function(data){
    var myindex = 1 * (getURLVar("page") || getURLVar("row")) - 1;
    getGeometry = function(){
      var feature = data.features[ myindex ];
      return feature;
    };
    runRows(data.features);
  });
}
else if(dataSource.toLowerCase().indexOf(".kml") > -1){
  // KML parser
  $.ajax({
    type: "GET",
    url: dataSource,
    dataType: "xml",
    success: function(data){
      //console.log(data);
      var myindex = 1 * (getURLVar("page") || getURLVar("row")) - 1;
      var placemarks = data.getElementsByTagName("Placemark");
      var features = [ ];
      for(var p=0;p<placemarks.length;p++){
              
        // assumes <ExtendedData><Data><value>... for any key-value pairs on each feature
        var props = { };
        var attributes = placemarks[p].getElementsByTagName("Data");
        for(var a=0;a<attributes.length;a++){
          if( attributes[a].getElementsByTagName("value").length ){
            props[ attributes[a].getAttribute("name") ] = $(attributes[a].getElementsByTagName("value")[0]).text();
            // check if attribute value could be a number
            if(!isNaN( 1.0 * props[ attributes[a].getAttribute("name") ] )){
              props[ attributes[a].getAttribute("name") ] = 1.0 * props[ attributes[a].getAttribute("name") ];
            }
          }
          else{
            // attribute with no value set in KML
            props[ attributes[a].getAttribute("name") ] = "";
          }
        }
        // represent KML <name> and <description> as replaceable properties
        if(placemarks[p].getElementsByTagName("name").length){
          props[ ">kmlname" ] = $(placemarks[p].getElementsByTagName("name")[0]).text();
        }
        if(placemarks[p].getElementsByTagName("description").length){
          props[ ">description" ] = $(placemarks[p].getElementsByTagName("description")[0]).text();
        }

        var geoType, geoCoordinates;        
        var coordtext = $(placemarks[p].getElementsByTagName("coordinates")[0]).text();
        var firstCoord = coordtext.indexOf("-");
        if(firstCoord == -1){
          firstCoord = 10000;
        }
        for(var i=0;i<10;i++){
          var firstOccurrence = coordtext.indexOf("" + i * 1.0);
          if(firstOccurrence >= 0){
            firstCoord = Math.min(firstCoord, firstOccurrence);
          }
        }
        coordtext = coordtext.substring(firstCoord).split(' ');
        
        if(placemarks[p].getElementsByTagName("LineString").length > 0){
          geoType = "LineString";
          geoCoordinates = [ ];
          for(var c=0;c<coordtext.length;c++){
            coordtext[c] = coordtext[c].split(',');
            if(coordtext[c].length < 2){
              // contains non-coordinate material
              continue;
            }
            geoCoordinates.push( [ 1.0 * coordtext[c][0], 1.0 * coordtext[c][1] ] );
          }
        }
        else if(placemarks[p].getElementsByTagName("Polygon").length > 0){
          geoType = "Polygon";
          geoCoordinates = [ ];
          for(var c=0;c<coordtext.length;c++){
            coordtext[c] = coordtext[c].split(',');
            if(coordtext[c].length < 2){
              // contains non-coordinate material
              continue;
            }
            geoCoordinates.push( [ 1.0 * coordtext[c][0], 1.0 * coordtext[c][1] ] );
          }
          geoCoordinates = [ geoCoordinates ];
        }
        else if(placemarks[p].getElementsByTagName("Point").length > 0){
          geoType = "Point";
          coordtext[0] = coordtext[0].split(',');
          geoCoordinates = [ 1.0 * coordtext[0][0], 1.0 * coordtext[0][1] ];
        }
        
        features.push({
          type: "Feature",
          properties: props,
          geometry: {
            type: geoType,
            coordinates: geoCoordinates
          }
        });
      }
      getGeometry = function(){
        return features[ myindex ];
      };
      runRows(features);
    }
  });
}
else{
  // GeoJSON parser
  $.getJSON(dataSource, function(data){
    var myindex = 1 * (getURLVar("page") || getURLVar("row")) - 1;
    getGeometry = function(){
      return data.features[ myindex ];
    };
    runRows(data.features);
  });
}

function runRows(rows){
  // get key and current page
  
  var keyrow = rows[ 0 ];
  var myrow = rows[ Math.max(0, 1 * (getURLVar("page") || getURLVar("row")) - 1) ];
  var mypageurl = (getURLVar("page") || getURLVar("row"));
  
  if(keyrow.length){
    // CSV
    for(var i=0;i<keyrow.length;i++){
      document.title = replaceAll( document.title, keyrow[i], myrow[i] );
      $(document.body).html( replaceAll( $(document.body).html(), keyrow[i], myrow[i] ) ); 
    }
  }
  else if(typeof keyrow.properties != "undefined"){
    // GeoJSON or SHP properties
    for(var prop in keyrow.properties){
      document.title = replaceAll( document.title, keyrow.properties[prop], myrow.properties[prop] );
      $(document.body).html( replaceAll( $(document.body).html(), keyrow.properties[prop], myrow.properties[prop] ) ); 
    }
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
  $.fn.oldtext = $.fn.text.clone();
  $.fn.text = function(){
    for(var a=0;a<arguments.length;a++){
      for(var i=0;i<keyrow.length;i++){
        arguments[a] = replaceAll( arguments[a], keyrow[i], myrow[i] ); 
      }
    }
    return $.fn.oldtext.apply(this, arguments);
  };

  // offer helper function to replace values with this row's values
  replaceRow = function(arg){
    if(typeof arg == "number"){
      // replace with fitting numbers
      if(keyrow.length){
        for(var i=0;i<keyrow.length;i++){
          if(keyrow[i] * 1 === arg){
            return myrow[i] * 1;
          }
        }
      }
      else if(typeof keyrow.properties != "undefined"){
        for(var prop in keyrow.properties){
          if(keyrow.properties[prop] * 1 === arg){
            return myrow.properties[prop] * 1;
          }
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
      if(keyrow.length){
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
      else if(typeof keyrow.properties != "undefined"){
        for(var prop in keyrow.properties){
          try{
            if(JSON.parse(keyrow.properties[prop]) && JSON.parse(keyrow.properties[prop]) == arg){
              return JSON.parse(myrow.properties[prop]);
            }
          }
          catch(e){
          }
        }
      }
    }
    else{
      // replace with fitting string
      if(keyrow.length){
        for(var i=0;i<keyrow.length;i++){
          arg = replaceAll(arg, keyrow[i], myrow[i]);
        }
        return arg;
      }
      else if(typeof keyrow.properties != "undefined"){
        for(var prop in keyrow.properties){
          arg = replaceAll(arg, keyrow.properties[prop], myrow.properties[prop]);
        }
        return arg;
      }
    }
  };
  
  next = function(){
    if(mypageurl < rows.length){
      window.location = (window.location+"").replace("page=" + mypageurl, "page=" + (mypageurl * 1 + 1)).replace("row=" + mypageurl, "row=" + (mypageurl * 1 + 1));
    }
  };

  previous = function(){
    if(mypageurl > 1){
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
}

// placeholders for JS helper functions
var replaceRow, next, previous, first, last, getGeometry;

function replaceAll(src, oldr, newr){
  if(typeof src == "undefined" || typeof src.indexOf == "undefined"){
    return src;
  }
  if((newr + "").indexOf((oldr + "")) > -1){
    return src;
  }
  while(src.indexOf(oldr) > -1){
    src = src.replace(oldr, newr);
  }
  return src;
}

function getURLVar(nm){nm=nm.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var rxS="[\\?&]"+nm+"=([^&#]*)";var rx=new RegExp(rxS);var rs=rx.exec(window.location.href);if(!rs){return null;}else{return rs[1];}}