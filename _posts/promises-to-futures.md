---
layout: post
title:  "The Rise of the Long-tailed Duck"
date:   2016-11-01
published: false
excerpt: "Western Lake Ontario has become home to a globally significant population of waterfowl, and the Hamilton Christmas Bird Count has documented this transition"
tag:
- birding
- Christmas Bird Count
- nature
- ornithology
- Long-tailed Duck
- waterfowl
- IBAs
- Lake Ontario
- Hamilton&#44; Ontario
- Burlington&#44; Ontario
- bird records
comments: false
feature: /assets/img/cbc-onha/ltdu.jpg
---
Example of the simplest Promise

If you're converting a Promise to a Future, let's assume you're doing some refactoring. In that case, we're going to need to limit the scope of our Future -- by carefully handling data-in and data-out.

So let's build a fort around what we'll be converting, as such:

```
(input) -> Future -> (output)
```

Here's a simple example.

```
    // where you have an existing Promise-based function
    // before converting to future:
    findCycleById(req.params.id).then(cycle =>
        renderProjectPage({ cycle })
    );
```

 Let's assume `renderProjectPage` is an output we don't need to worry about, first.

 Then, let's encase our `findCycleById`, which does some database lookups, in a new version.

```
    // Future-based version
    findCycleByIdFuture = Future.encaseP(a => findCycleById(a)); // `encaseP` means "encase a Promise"

    findCycleByIdFuture(req.params.id).fork(console.error, cycle =>
        renderProjectPage({ cycle })
    );
```

First, we wrap existing Promise-based functions (as far up the chain as you are comfortable with) with `Future.encaseP()` which will "encase" the Promise and ensure that it returns a Future instead.

This example is the simplest possible, with only one downstream function, within `.fork`. `.fork` will generally be your final part of a Future, at least while you are getting comfortable with them.

The only exception early-on is you should know about `.promise()` and `.done()` which allow converting the `Future` into a `Promise` or a nodeback, when you absolutely need to return a `Promise` or nodeback downstream.

