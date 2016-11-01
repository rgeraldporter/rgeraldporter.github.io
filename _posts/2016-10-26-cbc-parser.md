---
layout: post
title:  "Parser for Audubon's Christmas Bird Count Data"
date:   2016-10-26
excerpt: "Some tools for improving the usability of Audubon's CBC Data."
project: true
tag:
- birding
- christmas bird count
- Audubon
- nature
- Node.js
- Javascript
- CSV
- bird records
- ornithology
- digital naturalist tools
comments: false
feature: /assets/img/cbc-onha/song-sparrow.jpg
---      

The Audubon Society's annual Christmas Bird Count (CBC) is the longest annual volunteer species count in the world, and has been going on since 1900. That means there's a lot of data!

Anyone can [download the data from the Audubon](http://netapp.audubon.org/CBCObservation/Historical/ResultsByCount.aspx){:target="_blank"} for personal or non-profit/academic use. However the data isn't in the friendliest format around. While you can download the data in CSV, PDF, Excel, or XML format, the structure is very difficult to work with.

The data mixes total count records with other data points such as weather, participants, and the number of hours spent counting. Rather than spreadsheets with multiple pages seperating data, or splitting seperate kinds of data into separate files, everything is crammed into one.

This is why I've written a parsing tool for using the historical CBC data.

## Read more...

You can read more on the [GitHub repo](https://github.com/rgeraldporter/audubon-cbc-cli){:target="_blank"}, and can even comment or contribute ideas. It currently requires some technical know-how to use, but I aim to improve that over time as the bugs get worked out.
