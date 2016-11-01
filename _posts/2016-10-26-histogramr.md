---
layout: post
title:  "eBird Histogramr"
date:   2016-10-30
excerpt: "Convert eBird hotspot histograms into CSV files."
project: true
tag:
- ebird
- birding
- CSV
- Node.js
- Javascript
- bird records
- ornithology
- digital naturalist tools
comments: false
feature: /assets/img/cbc-onha/histogram-2.png
---      
[Cornell's eBird](http://ebird.org/){:target="_blank"} provides some fairly nifty looking bar graphs on [Hotspot locations](http://ebird.org/ebird/GuideMe?cmd=decisionPage&getLocations=hotspots&hotspots=L2093687&yr=all&m=){:target="_blank"}, but while you can download the data in a raw format, that format is a fairly obscure one. This project converts this data into a much more familar format, CSV.

I have two NPM modules so far, `ebird-histogramr` and `ebird-histogramr-cli`, the later being for general usage by anyone and the former for Node.js programmers looking to work with the data in a Javascript API.

## Read more...

You can read more on the [GitHub repo](https://github.com/rgeraldporter/ebird-histogramr-cli){:target="_blank"}, and can even comment or contribute ideas. It currently requires some technical know-how to use, but I aim to improve that over time as the bugs get worked out.
