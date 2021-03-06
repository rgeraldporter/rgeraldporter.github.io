
// jsData 
function gvisDataSteppedAreaChartID7e6016b74409 () {
var data = new google.visualization.DataTable();
var datajson =
[
 [
"2015",
2307
],
[
"2014",
5115
],
[
"2013",
4110
],
[
"2012",
374
],
[
"2011",
21954
],
[
"2010",
6805
],
[
"2009",
9024
],
[
"2008",
3967
],
[
"2007",
7118
],
[
"2006",
1580
],
[
"2005",
24304
],
[
"2004",
850
],
[
"2003",
8812
],
[
"2002",
17369
],
[
"2001",
10500
],
[
"2000",
337
],
[
"1999",
12855
],
[
"1998",
2171
],
[
"1997",
285
],
[
"1996",
37
],
[
"1995",
105
],
[
"1994",
516
],
[
"1993",
3
],
[
"1992",
16
],
[
"1991",
31
],
[
"1990",
13
],
[
"1989",
2
],
[
"1988",
11
],
[
"1987",
50
],
[
"1986",
45
],
[
"1985",
3
],
[
"1984",
225
],
[
"1983",
3
],
[
"1982",
1075
],
[
"1981",
225
],
[
"1980",
250
],
[
"1979",
500
],
[
"1978",
65
],
[
"1977",
48
],
[
"1976",
180
],
[
"1975",
96
],
[
"1974",
270
],
[
"1973",
25
],
[
"1972",
5
],
[
"1971",
110
],
[
"1970",
11
],
[
"1969",
100
],
[
"1968",
35
],
[
"1967",
150
],
[
"1966",
54
],
[
"1965",
17
],
[
"1964",
57
],
[
"1963",
550
],
[
"1962",
32
],
[
"1961",
11
],
[
"1960",
145
],
[
"1959",
27
],
[
"1958",
600
],
[
"1957",
491
],
[
"1956",
90
],
[
"1955",
5
],
[
"1954",
70
],
[
"1953",
37
],
[
"1952",
2
],
[
"1951",
2
],
[
"1950",
5
],
[
"1949",
31
],
[
"1948",
8
],
[
"1947",
29
],
[
"1946",
56
],
[
"1945",
1
],
[
"1944",
14
],
[
"1943",
7
],
[
"1942",
19
],
[
"1941",
1
],
[
"1940",
5
],
[
"1939",
2
],
[
"1938",
9
],
[
"1937",
2
],
[
"1936",
35
],
[
"1935",
8
],
[
"1934",
12
],
[
"1933",
12
],
[
"1932",
70
],
[
"1931",
3
],
[
"1930",
25
],
[
"1928",
0
],
[
"1926",
0
],
[
"1925",
0
],
[
"1924",
0
],
[
"1922",
0
],
[
"1921",
0
] 
];
data.addColumn('string','year');
data.addColumn('number','Long-tailed Duck');
data.addRows(datajson);
return(data);
}


// jsDrawChart
function drawChartSteppedAreaChartID7e6016b74409() {
var data = gvisDataSteppedAreaChartID7e6016b74409();
var options = {};
options["allowHtml"] = true;
options["width"] = 1300;
options["height"] = 300;
options["legend"] = {"position":"top"};


    var chart = new google.visualization.SteppedAreaChart(
    document.getElementById('SteppedAreaChartID7e6016b74409')
    );
    chart.draw(data,options);
    

}
  


// jsDisplayChart
(function() {
var pkgs = window.__gvisPackages = window.__gvisPackages || [];
var callbacks = window.__gvisCallbacks = window.__gvisCallbacks || [];
var chartid = "corechart";
  
// Manually see if chartid is in pkgs (not all browsers support Array.indexOf)
var i, newPackage = true;
for (i = 0; newPackage && i < pkgs.length; i++) {
if (pkgs[i] === chartid)
newPackage = false;
}
if (newPackage)
  pkgs.push(chartid);
  
// Add the drawChart function to the global list of callbacks
callbacks.push(drawChartSteppedAreaChartID7e6016b74409);
})();
function displayChartSteppedAreaChartID7e6016b74409() {
  var pkgs = window.__gvisPackages = window.__gvisPackages || [];
  var callbacks = window.__gvisCallbacks = window.__gvisCallbacks || [];
  window.clearTimeout(window.__gvisLoad);
  // The timeout is set to 100 because otherwise the container div we are
  // targeting might not be part of the document yet
  window.__gvisLoad = setTimeout(function() {
  var pkgCount = pkgs.length;
  google.load("visualization", "1", { packages:pkgs, callback: function() {
  if (pkgCount != pkgs.length) {
  // Race condition where another setTimeout call snuck in after us; if
  // that call added a package, we must not shift its callback
  return;
}
while (callbacks.length > 0)
callbacks.shift()();
} });
}, 100);
}
