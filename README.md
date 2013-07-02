# Row-to-Scope

## Concept

If you can write HTML, you can put all of your data records online! Row-to-Scope paints
over the page for every row in your data.

* /row?page=1 is the page with the first row's data
* /row?page=2 is the page with the second row's data
* ...

### Key Components

* The row/index.html page is how the page should look for the first row in your data.

* data/data.csv is a spreadsheet of your data.

* The index.html page is a static homepage for your app. Use it for important information
and links.

### More Detailed Info

* To change from data/data.csv to data/geojson.geojson or another file, add a tag just above the &lt;script&gt; tag for row-to-scope.js

    &lt;script type="text/javascript"&gt;var dataSource = "data/geojson.geojson";&lt;/script&gt;

* In JavaScript, replaceRow( "NAME" ) will convert a value in the first row to a value from the requested row

* Put JavaScript code that runs after the correct row is loaded inside an init() function.

### Tips

* The user downloads the whole database every time that they visit a page! Don't use this for many thousands of rows.

* For maps, 3D pointclouds, and other large datasets, put those files in the /data folder. Then list a file name ("row1.geojson", "row2.geojson", etc.) in each row, and program your page to load the right file.

* Fill the first row with column names like {{NAME}}, {{DESCRIPTION}}, {{HEIGHT}} so that it's easier to write your template page. /row?page=1 will be template, but the rest will have your data.

* Put &lt;script&gt; and &lt;style&gt; tags in the &lt;head&gt; of the page.

## Supported Formats

* CSV
* GeoJSON
* (future) KML

## Not as good as Jekyll or Sheetsee

If you want to
<a href="http://jekyllrb.com/">build blogs and no-CMS websites</a> or
<a href="http://jlord.github.io/sheetsee.js/">visualize data from Google Spreadsheets</a>,
there are other, much better tools to do that!

Row-to-Scope is just designed to be as simple as possible.

