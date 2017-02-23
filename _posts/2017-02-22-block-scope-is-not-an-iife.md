---
layout: post
title:  "Beware: Using Javascript's Block Scope as an IIFE can be... Iffy"
date:   2017-02-22
excerpt: "Many assume this ES6 feature is equivalent to an IIFE, but it can be quite leaky if you're not careful"
tag:
- Javascript
- ES6
- transpiling
- Node.js
- IIFE
- Angular.js
- Programming
comments: false
feature: /assets/img/tychoInst6.gif
---

The advent of [ES6 Javascript](http://es6-features.org/){:target="_blank"} brought many game-changing features that were desperately needed in the language. The introduction of `let` and `const` are especially important, as they allowed for better control over variables and scoping.

Another celebrated new feature was the introduction of **block scoping**, which allows you to wrap any arbitrary piece of code in braces to indicate, well, a block scope.

Countless [guides](https://jack.ofspades.com/es6-iife-with-fat-arrow-functions/){:target="_blank"} [out there](http://wesbos.com/es6-block-scope-iife/){:target="_blank"} [tout this](https://medium.freecodecamp.com/5-javascript-bad-parts-that-are-fixed-in-es6-c7c45d44fd81#.pvazi981g){:target="_blank"} [as the successor](http://www.benmvp.com/learning-es6-block-level-scoping-let-const/){:target="_blank"} to the **immediately-invoked function expression** (IIFE) -- normally used to isolate the scope of a given block of Javascript.

However, there are a series of conditions that need to be met in order to fulfill block scope's destiny to become the fill-in for the awkward IIFE.

## Leaky functions

Out of the box, if you were to use block scope right now on Chrome, Safari, or Firefox (and likely other browsers and Node.js), there are some problems with block scope being leaky.

These issues begin to emerge when you attempt to use a block to scope a declared function. For example:

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

The solution to this problem, is to force the Javascript runtime into "strict" mode, in the scope of where the block scope is declared. Like this:

as compared with:
{% highlight js %}
'use strict';
// block scope
{
    function foo () {
        return true;
    }
}

// throws an error
foo();
{% endhighlight %}

## Context is key

Most discussions about block scoping are specifically referencing the use of `const` and `let` declarations within a block. This is the case where the block scope shines, out-of-the-box, without any stict mode: the ES6 declarations of `let`, `const`, and even `class` never leak outside of the scope.

Let's see what happens when I rewrite `foo()` as a **constant function expression** (CFE... can I coin that?):

{% highlight js %}
{
    const foo = () => true;
}

// fails, is undefined outside of the block scope
foo();
{% endhighlight %}

However, keeping declared functions (using the `function` keyword) contained within the block scope requires strict mode to be enabled, and that isn't usually mentioned in guides that discuss using this technique.

Also of note: `var` will never contain itself within a block scope, no matter what you try. It will always leak out, and while there's not really any great reasons to use `var` any longer, as you'll see shortly, transpilers still do.

## Transpiling with Babel and Traceur

If you're writing client-side ES6 code, even with the high levels of compliance we're starting to see today, you're still likely to be transpiling down to ES5.

Transpilers work to make your code work as closely to perfect as possible in an older version of Javascript. Usually this amounts to something less efficient being used -- it's usually not something that a developer would notice any difference in behaviour.

Oddly, block scoping in [Babel](https://babeljs.io/){:target="_blank"} is one of those rare cases where things do act differently.

A practical example would be taking some Angular 1.x code, and instead of wrapping a file with an IIFE, let's wrap it with block scoping:

{% highlight js %}
'use strict';
{
    angular
        .module( 'myModule' )
        .component( 'myFoo', {
            templateUrl: '/templates/components/foo.html',
            bindings   : {},
            controller : Foo
        } );

    Foo.$inject = [ 'Something' ];

    function Foo( Something ) {
      // do stuff
    }
}
{% endhighlight %}

Run this through Babel (in ES2015/ES6 mode), and the result is:

{% highlight js %}
'use strict';

{
    var Foo = function Foo(Something) {
        // do stuff
    };

    angular.module('myModule').component('myFoo', {
        templateUrl: '/templates/components/foo.html',
        bindings: {},
        controller: Foo
    });

    Foo.$inject = ['Something'];
}
{% endhighlight %}

**Note that the function declaration is now a function expression, using `var`.** Unfortunately, `var` leaks out of block scope by design (it is function scoped, not block scoped), and the whole point of wrapping the file in an IIFE is lost as the function now lives in global scope.

Running this through an alternative, [Traceur](https://github.com/google/traceur-compiler){:target="_blank"}, basically results in the same thing:

{% highlight js %}
$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  {
    var Foo = function(Something) {};
    angular.module('myModule').component('myFoo', {
      templateUrl: '/templates/components/foo.html',
      bindings: {},
      controller: Foo
    });
    Foo.$inject = ['Something'];
  }
  return {};
});
{% endhighlight %}

Why Babel and Traceur don't just convert the block into an IIFE, I'm not sure. Certainly if you've declared you'd like the block handled strictly, I would think that is enough to infer that transpiling it to an IIFE.

For Babel, the only way to get a more correct result is to use the ES2016 setting, however that may be making too much of an assumption about the freshness of your users browsers.

In coming years, block scope is certain to replace the need for IIFEs. Until that time, however, be very careful about using them, and to use them effectively and without side-effects, don't make assumptions -- make good tests.<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />

* For reference, a quick test you can run to reveal a function leaking from block scope: [blockscope.js](https://gist.github.com/rgeraldporter/3f94db1d0b5515789c9675cb659b7cc3){:target="_blank"}