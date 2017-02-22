---
layout: post
title:  "Beware: Using Javascript's Block Scope as an IIFE can be... Iffy"
date:   2017-02-22
excerpt: "Many assume this ES6 feature is equivalent to an IIFE, but it can be quite leaky"
tag:
- Javascript
- ES6
- Node.js
- IIFE
- Programming
comments: false
feature: /assets/img/tychoInst6.gif
---

The advent of [ES6 Javascript](http://es6-features.org/){:target="_blank"} brought many game-changing features that were desperately needed in the language. The introduction of `let` and `const` are especially important, as they allowed for better control over variables and scoping.

Another celebrated new feature was the introduction of **block scoping**, which allows you to wrap any arbitrary piece of code in braces to indicate, well, a block scope.

Countless [guides](https://jack.ofspades.com/es6-iife-with-fat-arrow-functions/){:target="_blank"} [out there](http://wesbos.com/es6-block-scope-iife/){:target="_blank"} [tout this](https://medium.freecodecamp.com/5-javascript-bad-parts-that-are-fixed-in-es6-c7c45d44fd81#.pvazi981g){:target="_blank"} [as the successor](http://www.benmvp.com/learning-es6-block-level-scoping-let-const/){:target="_blank"} to the **immediately-invoked function expression** (IIFE) -- normally used to isolate the scope of a given block of Javascript. If block scoping really did fully replaces the IIFE, this would be worth celebrating as the IIFE method is a bit awkward looking.

What most guides don't mention however, is that the IIFE and the block scope are not exactly equivalent.

## Leaky functions

The problem with block scoping emerges when you attempt to use a block to scope a declared function. For example:

{% highlight js %}
// IIFE
(function() {
    function foo () {
        return true;
    }
})();

// fails, as foo() is undefined outside of the IIFE
foo();
{% endhighlight %}

as compared with:
{% highlight js %}
// block scope
{
    function foo () {
        return true;
    }
}

// returns "true", is accessible
foo();
{% endhighlight %}

So if the block scope is leaky to something as basic as a function declaration, why are so many celebrating it as an alternative to the IIFE?

## Context is key

Most discussions about block scoping are specifically referencing the use of `const` and `let` declarations within a block. This is the case where the block scope shines: these kinds of declarations never leak outside of the scope.

Let's see what happens when I rewrite `foo()` as a **constant function expression**:

{% highlight js %}
{
    const foo = () => true;
}

// fails, is undefined outside of the block scope
foo();
{% endhighlight %}

## Uses for block scope?

If you're using constant function expressions (CFEs? Can I coin that please?), then block scoping works great for containing your functions. I will admit, however, I have not found many great uses for this yet. Generally if you are using CFEs exclusively, you are probably writing in a functional style, and I've not seen much done with block scoping in functional Javascript (at least, not yet).

A problem that block scoping introduces is that it does increase the [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity){:target="_blank"} of a function -- much like adding an `if` or `for` statement. (These are also frowned upon, if not outright banned, in more functional style.)

One good use I've put them to though, is to help add block scope to language features that lack this. The best example would be `case` blocks in the `switch` statement. `case` labels have always looked odd in Javascript, but if you add block scoping, they look more at home:

{% highlight js %}
// without block scoping:
var counter = 0;
var result;

switch (bar) {
    
    case 'one':
        result = getResult(bar);
        counter = 1 + result;
        break;

    case 'two':
        result = getADifferentResult(bar);
        counter = 2 + result;
        break;
}
{% endhighlight %}

It's not a very sophisticated example, but one side effect of having to do some calculations inside `case` labels is that the `var result` used needs to be declared earlier, and thus shared with the whole scope. Compare this with using block scoping and a `const` inside:

{% highlight js %}
// with block scoping:
let counter = 0;

switch (bar) {
    
    case 'one': {
        const result = getResult(bar);
        counter = 1 + result;
        break;
    }
    case 'two': {
        const result = getADifferentResult(bar);
        counter = 2 + result;
        break;
    }
}
{% endhighlight %}

Here I have block scoped each case, and thus `result` can never leak out. While the scale of this example is quite small of course, in the bigger picture, scoping in this way allows the [Javascript garbage collector](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/){:target="_blank"} to do its work.

## In search of a successor to IIFEs

So far I still have no exact functional alternative to writing the awkward IIFE with in Javascript using any of the newer ES6 (or ES2016/ES2017) features -- unless of course you don't need to declare functions -- but even then, I don't believe the leaky-scope for functions in a block scope is widely known, so you may risk future developers in your code making assuptions about any block scoping. IIFEs are still a staple to frameworks [like Angular 1.x](https://toddmotto.com/minimal-angular-module-syntax-approach-using-an-iife/#introducing-an-iife){:target="_blank"} precisely so that function declarations can be scoped. The best one can do in a refactor these frameworks is to convert IIFEs to use arrow functions:

{% highlight js %}
() => {
    function foo () {
        return true;
    }
}();
{% endhighlight %}

... but it's still ugly, and could be considered less clear about what is going on -- not to mention the [lexical scoping](https://toddmotto.com/es6-arrow-functions-syntaxes-and-lexical-scoping/){:target="_blank"} issues this could introduce.<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />