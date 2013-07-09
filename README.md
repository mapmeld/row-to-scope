# Row-to-Scope

## Concept

If you can write HTML, you can put all of your data records online! Row-to-Scope paints
over the page for every row in your data.

* /row?page=1 is a page with the first row's data
* /row?page=2 is a page with the second row's data
* /row?page=3 is a page with the third row's data
* ...

### Key Components

* The row/index.html page is how the page looks for the first row in your data.

* data/data.csv is a spreadsheet of your data. Use CSV, KML, GeoJSON, or shapefiles.

* The index.html page is a homepage for your app. Use it for important information and links.

### Get Started

Start with one of these examples inside a &lt;script&gt; tag:

```javascript
    // Example 1: replace everything on this page using data/data.csv
    rowToScope();
    
    // Example 2: custom data source
    rowToScope( "../data/data.csv" );
    
    // Example 3: run JavaScript after the correct row is loaded
    rowToScope( "../data/data.csv", function( row ){
      // run JavaScript here
      // row is an array of values from this row
    });
    
    // Example 4: run JavaScript after the correct geo feature is loaded
    rowToScope( "../data/data.geojson", function( feature ){
      // run JavaScript here
      // feature is GeoJSON with geometry and properties
      // works for all formats: shapefile, Google Earth KML, and GeoJSON
    });
    
    // Example 5: run JavaScript and replace first row values with the current row
    rowToScope( "../data/data.csv", function( row ){
       // direct replacement
       alert( "My name is " + rowToScope.replaceRow("Nick") + "!" );
       
       // multiple replacement
       alert( rowToScope.replaceRow( "I live in Boston, and I write JavaScript" ) );
    });
```

### More Detailed Info

* In JavaScript, rowToScope.replaceRow( "NAME" ) will convert any values it finds from the first row to a value from the requested row

* replaceRow also replaces numbers, arrays, and JSON objects from the first row.

* jQuery functions $.html and $.text will automatically replace values from the first row.

* For all geo formats, the callback returns a GeoJSON feature (including geometry and properties). For example, with Leaflet:

```javascript
        rowToScope("../data/data.geojson", function(feature){
          L.geoJson( feature ).addTo(map);
        });
```

or, to be more detailed and include replaceRow

```javascript
    var rts = rowToScope("../data/data.geojson", function(feature){
      L.geoJson( feature, {
        onEachFeature: function(f, layer){
          layer.bindPopup( rts.replaceRow("60647") );
        }
      }).addTo(map);
    });
```

* Functions rowToScope.previous(), rowToScope.next(), rowToScope.first(), and rowToScope.last() let you page through the rows after data has been loaded.

### Tips

* The user downloads the whole dataset every time that they visit a page! Don't use this for many thousands of rows.

* Fill the first row or feature with column names like {{NAME}}, {{DESCRIPTION}}, {{HEIGHT}} so that it's easier to write your template page. /row?page=1 will be template, but the rest will have your data.

* Put &lt;script&gt; and &lt;style&gt; tags in the &lt;head&gt; of the page, so they don't get loaded twice.

* For complex maps, 3D pointclouds, and other large datasets, place those files in the /data folder. List a file name ("row1.geojson", "row2.geojson", etc.) in your data.csv, so your page loads only one of these large datasets and not the complete set for each row. Use <a href="https://github.com/mapmeld/row-to-scope/tree/gh-pages/demos/webgl/data">the WebGL example</a> as a guide.

* (Future) If you have a meaningful ID for each row, use an {{ID}} column in a CSV, or ID property to a GeoJSON. Then link to pages using /row?id=SPECIAL_ID

## Supported Formats

* CSV
* GeoJSON
* Google Earth KML
* Shapefile using <a href="https://github.com/calvinmetcalf/shapefile-js">shapefile-js</a>

## Consider Jekyll or Sheetsee

If you want to
<a href="http://jekyllrb.com/">build blogs and no-CMS websites</a> or
<a href="http://jlord.github.io/sheetsee.js/">visualize data from Google Spreadsheets</a>,
there are much better tools to do that!

Row-to-Scope is just designed to be as simple as possible.

