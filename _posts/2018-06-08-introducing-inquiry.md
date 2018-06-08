---
layout: post
title:  "Introducing Inquiry: A process flow in Javascript"
date:   2018-06-08
published: true
excerpt: "A Javascript process for testing data and aggregating results."
tag:
- Javascript
- functional programming
- Node.js
- InquiryJS
comments: false
feature: /assets/img/vinci.jpg
---
For many years, like many Javascript coders, I've been using Javascript's Promises. They are a great tool for handling code in a nice, readable flow that makes asyncronous JS much easier to read and understand.

However, the nature of a Promise chain is vulnerable to mutation. It is quite a common practice to start a chain with one a starting value, and end the chain with no notion how the resulting value was ever produced. For those who have taken a dive into functional programming as I have, Promises begin to look like scary "non-functional" functions that have all kinds of mutations and side-effect that are not under control. These functions become something like buying groceries at a store where you're only told the final price, and not given a receipt with line-by-line accounting of your purchases.

That stated, Promises are still a necessity for handling asyncronous behaviours (unless you're willing to switch to Futures). Through some experimentation I've come to an API that can help with limiting the scope of Promises, while also helping give "receipts", both from your asyncronous functions, and your syncronous ones.

## Inquiry

My solution has been to create a process flow API that is expressive enough for someone unfamiliar to understand what's going on, while retaining good practices from functional programming.

Inquiry takes a starting value (known as a "subject"), and then chains together functions that return (or resolve, in the case of Promises) either a `Pass` or a `Fail` value. These passes and fails get collected and reported at the end of the chain, to be handled however the author prefers at the end.

To see how it all works, please see the documentation at: [https://github.com/rgeraldporter/inquiry-monad/blob/master/README.md]

The API for Inquiry has gone through many phases and experiments, and I believe it's reaching a point of being fairly solid. I still have some work to do on improving the unit tests, and I aim to be providing interactive examples before I say it's ready for production use.

It is still "early days" on this project, meaning that as long as I have the version number at `0.x` the API is not necessary written in stone, but once I feel it is stable, I will increment it to `1.x`.