---
layout: post
title: 'Building Expressive Monads in Javascript: Introduction'
date: 2019-06-06
published: true
excerpt: 'The monad is a powerful design pattern that, when used correctly, can completely change how you think about handling values in Javascript.'
tag:
    - Javascript
    - moands
    - functional programming
comments: false
feature: /assets/img/kepler.jpg
---

The monad is a powerful design pattern that, when used correctly, can completely change how you think about handling values in Javascript (JS). This introductory tutorial is for any level of JS familiarity, even (and perhaps, especially) beginners.

For those already familiar with monads, this introduction only covers the essentials for using monads effectively, and will only touch upon the origins and more technical language when necessary to give context. No attempts will be made to explain category theory or deep concepts of functional programming.

## What does "monad" mean?

For the purposes of this introduction, I'd like to refer to the dictionary definition, which pre-dates its use in mathematics and programming: _a single unit_.

This definition is akin to _dyad_ and _triad_ - meaning two, or three units respectively.

The term is used in mathematics, in category theory. For programming, the monad was made popular by Haskell, and has been transposed into various languages, including JS. It is used as a way of containing values and controlling mutations.

I think though that the definition of _"a single unit"_ is good to keep in mind.

## What problems do monads solve?

Any time you've had to deal with trying to keep track of value mutation, any compatible type of monad would have helped wrangle how the values are changing.

If you've struggled with `null` and `undefined` causing havoc in functions that can't handle them, a `Maybe` monad would solve that problem.

For myself, it helps break down value-altering processes into small steps, allowing me to think about one piece at a time, not worrying about values mutating in unexpected ways. One can focus better on individual functions more easily. The results are so much more predictable, and the steps in the process more testable.

Monads can even handle processes that are asyncronous, but for the purposes of this introduction, we're only going to focus on syncronous cases.

## How is it used in Javascript?

A monad is best thought of as a container of a value: much like how the container-like types `Array` and `Object` can hold a collection of values, a monad does the same.

Each monad you build is like building a new kind of container-like type. As `Array` has methods like `forEach`, and as `Object` has methods like `keys`, a monad will have standard methods, and methods you can add on a case-by-case basis.

If you've used `Array` and `Object`, you've already got some experience that will be useful with monads.

## The most basic monad: `Identity`

We'll start our first example with the most basic possible monad, an `Identity` monad.

### First though, a quick note on monad naming and style conventions...

Before we begin to build an `Identity` monad, I'd like to make clear the naming and styles you'll see in this introduction. When first learning monads, I was quickly hung up on the names and styles. It was enough to slow me down quite a bit.

You'll see monads named with capital letters, often with rather abstract names.

Do not get too concerned with the naming; if an abstract name is confusing you, remember that it is said that _"naming things is one of the hardest things in computer science"_. Often these names point to a particular established design pattern that may have multiple possible awkward-sounding names.

The monad names will be capitalized -- this is an established convention, my assumption is this is to demonstrate they are a special type, much like a `class` name.

The same will go with monad method names, the most common ones have many established names. When one is introduced, I'll mention other names you may find being used for the same method. I will aim to focus on whichever method name I feel is most expressive for someone new to monads, though opinions will likely differ.

### Second, a quick note on the term "identity"...

One more brief side-note: the monad name `Identity` is based on a term "`identity`" used for a function which simply returns the value given to it. The `Identity` monad will effectively do the same. This may seem like a near-useless function (it doesn't do anything!) but it is great for giving the most basic example, and there are some actual use cases in functional programming. 

For instance, if you are required pass a function as an argument to potentially alter a value, but wanted to ensure that function didn't actually alter the value in certain circumstances, an identity is a great way to do that.

### `Identity`: the code

```js
const Identity = x => ({
    emit: () => x,
    chain: f => f(x),
    map: f => Identity(f(x))
});

// example use:
const one = Identity(1);
```

Yes, that is all. Write something like the above, and you have written a monad. These are the three required methods.

Many tutorials will hand you a library and just show how to use monads, but I feel a hands-on approach is going to actually make it easier to understand the concept.

That all stated, this `Identity` monad, at 5 lines, has a lot going on. Let's break that down.

#### `const Identity = x => ({ ... });`

The simplest part: we'll be using `const` as we don't want our defintion to ever change. You might know or have heard that `const` isn't perfect at locking down mutations: if you use `const` to define an `Array` or `Object`, and those can subsequenly mutate.

Thankfully, we're assigning a _function expression_ to our `const`, which I like to refer to as a _Constant Function Expression_ (CFE). I prefer these over the standard `function` defintion as they prevent anyone ever meddling with the function prototypes.

If you look up monad libraries in JS often you will find them based upon `function` or `class`, which makes them susceptible to meddling.

Our value we're going to pass into the `Identity` monad is `x`, and the beauty of a CFE is that the arguments passed into it cannot ever be altered or changed: it is absolutely immutable without having to use any special APIs.

This is why I love this pattern for monads: in just a few lines with no advanced syntaxes it creates an absolutely immutible value!

Once we pass `1` as a value in, nothing can ever change that `1` was the value passed in. If we had used a class and stored the value in an accessor, without some special API usage we'd be able to something like `myIdentity.__value = 2` and just change the value.

And while I have not tested this hypothesis, I would think this is the JS monad pattern with the least-possible memory footprint.

Let's start looking at the core methods.

#### Method: `emit`

**Alternative names:** `join`, `value`

##### Code

```js
emit: () => x,
```
##### Example use

```js
console.log(one.emit());
// > 1
```

This is the simplest method, that just returns the value contained within. Most commonly known as `join`, however I find that quite unexpressive. I like `emit` for explaining what it does as a verb: emit the value contained within.

#### Method: `chain`

**Alternative names:** `flatMap`, `bind`

##### Code

```js
chain: f => f(x),
```
##### Example use
```js
console.log(one.chain(a => a + 1));
// > 2
```

The next simplest method is `chain`, which is intended to _chain_ various monads together, but can operate as demonstrated above.

`f => f(x)` indicates a function `f` is taken, and value `x` is passed to said function. In this example, `a => a + 1` takes the value, returns it plus one.

A more typical usage may be:

```js
one.chain(a => SomeMonad(a + 1));
```

Where `SomeMonad` is a monad. In this `chain`, we transform `Identity(1)` into `SomeMonad(2)`. When you are using `chain`, typically you're indicating that the function you are passing in either will itself return a monad (preventing recursive monad-inside-monad-inside-monad...) or that you intend for the result to be non-monadic.

Don't worry too much about _why_ right now, as this I find is less commonly useful as compared to the next method, `map`. But it is important to understand first before we look at `map`.

#### Method: `map`

**Alternative name:** `fmap` ("functional map")

##### Code

```js
map: f => Identity(f(x))
```

##### Example use
```js
console.log(one.map(a => a + 1));
// > [not pretty: outputs monad defintion... at least until we implement .inspect() below]
```
`map` is the most important method. This is what makes monads so useful: we can take an established monad `Identity(1)` and through a function, generate `Identity(2)` without any mutation of our example constant `one`.

Put simply, it is the `chain` function with a built-in rewrapping of the resulting value into a new `Identity`, which itself can be subject to `map`, `chain`, and `emit` on and on for as many functions you'd like to apply to it.

This is the method I most use in a monad.

I sometimes like to think of it like a bank account ledger. All values must be accounted for: where they started (`.of`), and how they changed over time (`map` & `chain` methods). The initial value of a monad is like a new bank account being opened with an initial deposit, each `map` or `chain` is a transaction atop it. Nothing will ever change the value of the initial deposit, but we have methods to figure out how much remains in the account today.

#### One more method: `inspect`

You may have noticed doing a console output of the value after a map isn't going to look pretty. While not strictly required to make a monad work correctly, `inspect` can help inform us via the console what exactly is in the monad, and what type of monad it is.

```js
const Identity = (x) => ({
	chain: f => f(x),
	emit: () => x,
	map: f => Identity(f(x)),
	inspect: () => `Identity(${x})`
});

const one = Identity(1);
const two = one.map(a => a + 1);

console.log(two.inspect());
// > Identity(2)
```

This method is important in debugging as a simple `emit` would not give you the type `Identity`; just the contained value `2`. This is very important when working with multiple monad types.

#### Lastly, adding a constructor

In all the examples above I have been calling directly `Identity`. Typically, however, there is a constructor method. In JS, the convention is to add an `of` constructor. This looks like:

```js
const one = Identity.of(1);
```

This helps in a couple ways. One, `of()` is a very strong hint we're dealing with a monad, as there's probably nowhere else you'll see it.

Secondly, it'll allow you to do type-checking behaviour, should your monad have restrictions on what is passed into it.

Typically I handle this using import/export, as such:

```js
const Identity = x => ({
    emit: () => x,
    chain: f => f(x),
    map: f => IdentityOf(f(x)),
    inspect: () => `Identity(${x})`
});

// you might do type-checking here
const IdentityOf = x => Identity(x);

const exportIdentity = {
    of: IdentityOf
}

// or module.exports
export {
	exportIdentity as Identity
}
```

```js
// or require()
import { Identity } from './Identity.js`;
```

Enough examples from me, though. Time for you to give it a try.

_Try it out: [Identity Monad Example REPL](https://repl.it/@rgeraldporter/Identity-Monad-Example)_

## Let's make another monad: `List`

`List` is the typical name of an `Array`-like monad.

We'll start with our `Identity`, but rename it.

```js
const List = x => ({
    emit: () => x,
    chain: f => f(x),
    map: f => List.of(f(x)),
    inspect: () => `List(${x})`
});
```

_For the purposes of this example, we'll assume `of` constructor has been added to this. When actually making one, we'd also type-check in the `of` constructor to ensure the passed value is an `Array`._

#### Adding more methods

As you can see with the addition of `inspect`, adding new methods is very easy. And if you write your own monad, why not add methods if you have a particular function you use with `map` or `chain` a lot?

In my experience, there are two kinds of methods you might add:

1. `map`-like: methods that return back the same type of Monad
2. `chain`-like: methods that either return a different kind of monad, or a non-monadic value; it may or may not "exit" the monad pattern, which I like to refer to as "unwrapping" the monad value

#### Method: `concat`

Concatenation is a fairly simple concept from `Array`: take one array, and add it onto the end of another. This seems like a method that would be very useful to have available.

```js
concat: a => List.of(x.concat(a)),

// e.g.

const myNumbers = List.of([1, 3, 4, 7, 10]);

myNumbers.concat([12]).inspect();
// > List(1,3,4,7,10,12);
```

The function is simple: make a new `List` from using `Array.concat` on the contained value and the incoming value.

Note that this is `map`-like; it returns a new `List`.

#### Method: `head`

Let's say we wanted to just know what the first item in the `List` is. It's not an `Array` so using an index accessor like `[0]` isn't going to work.

```js
head: () => x[0],

// e.g.

const myNumbers = List.of([1, 3, 4, 7, 10]);

myNumbers.head()
// > 1
```

This method is `chain`-like, as it returns a non-monadic value -- in this case, unwrapping part of the value. This one exits the monad pattern, so be aware when using these kinds of methods that continuing to chain `map`, `emit`, `inspect`, etc will not work.

```js
const myNumbers = List.of([1, 3, 4, 7, 10]);

myNumbers.head().inspect();
// > ERROR! We unwrapped from the monad at `.head()`!
```

#### More methods

If you know `Array` well, you know it has an awful lot of methods. You can build a `List` with all kinds of things. 

So here's a good excercise -- take this basic `List` monad and write some methods of your own!

_Try it out: [List Monad Example REPL](https://repl.it/@rgeraldporter/List-Monad-Example)_

## `Maybe`: the most powerful monad

It's possible you've heard of `Maybe` (also known as `Option`): the oddly named, but incredibly useful and powerful monad pattern.

The name "maybe" refers to the idea of "maybe there is a value... but maybe there is not".

In JS, having values that are `undefined` and `null` can cause havoc in the wrong place. What if, in every case where we currently have to place an awkward `if (x === undefined || x === null)` statement, we just could handle those cases right inside the value's container and never expose those unsightly and troublesome null values?

### The code

_Here comes a lot of code. Don't worry, we'll go through it all._

```js
const Just = (x) => ({
  chain: f => f(x),
  emit: () => x,
  map: f => MaybeOf(f(x)),
  fork: (_, g) => g(x),
  isJust: true,
  isNothing: false,
  inspect: () => `Just(${x})`,
});

const Nothing = (x) => ({
  chain: _ => Nothing(),
  emit: () => Nothing(),
  map: _ => Nothing(),
  fork: (f, _) => f(),
  isJust: false,
  isNothing: true,
  inspect: () => `Nothing`,
});

const MaybeOf = x => x === null || x === undefined || x.isNothing ? Nothing() : Just(x);

const exportMaybe = {
  of: MaybeOf
};

export { 
	exportMaybe as Maybe
}
```

### Use case

To give an example where this would be useful, let's have system that reads a temperature in Fahrenheit and gives it out in Celsius.

```js
const fahrenheitToCelsius = a => (a - 32) * 0.5556;

const reading1 = 15;
const reading2 = null;

const temp1C = Maybe.of(reading1)
					.map(fahrenheitToCelsius);
					
console.log(temp1C.inspect());
// > Just(-9.4444)
					
const temp2C = Maybe.of(reading2)
					.map(fahrenheitToCelsius);

console.log(temp2C.inspect());
// > Nothing()
```

Right away we have a problem: for function `fahrenheitToCelsius` to work, we need `a` to be a number. Since `reading2` is `null` (maybe a dead thermometer?), Javascript will cast `null` to `0`, giving a constant false reading of `-17.7792`.

However, since we have encapsulated in a `Maybe` monad we only have two possibilities: a real number (`Just`, as in "just a value"), and no value at all (`Nothing`).

### Explanation

How did this happen?

Our `Maybe.of` constructor did it:

```js
const MaybeOf = x =>
	x === null ||
	x === undefined ||
	x.isNothing ? Nothing() : Just(x);
```

If the value being encapsulated in the monad was not `undefined`, `null`, or already a `Nothing`, then it is kept in `Just`. While the name `Just` may look new to you, its concept is almost identical with `Identity`! So you pretty much know already how `Just` works.

`Nothing` is a rather different monad than most: it doesn't take a value, and every method you use will result in `Nothing()`. After a `Maybe` has cast a value to `Nothing` there's no going back -- all attempts to `map` or `chain` just result in `Nothing`, so you need not worry about functions having unexpected behaviours since they _never actually run_.

But we need to handle what we do with `Nothing`, eventually...

### Method: `fork`

Here enters the prized method of the `Maybe` monad given above: `fork`. 

_One quick side note: not all `Maybe` monad implementations will have a `fork`, but handle `Nothing` in other ways. For this tutorial however, we'll be using it, because we can!_

`fork` is a method in two places here: in `Just` and `Nothing`

```js
// Just
fork: (_, g) => g(x),

// Nothing
fork: (f, _) => f(x),
```

Right away you might see something odd. `_` is a style choice often used in functional programming to indicate where we know there will be a value passed, but we plan not to use it. It is like the opposite of a placeholder.

Now let's use it for temperature display:

```js
// assume a `display` function to display the temperature reading, and act like console.log

const fahrenheitToCelsius = a => (a - 32) * 0.5556;

const reading1 = 15;
const reading2 = null;

Maybe.of(reading1)
	.map(fahrenheitToCelsius)
	.fork(
		_ => display('ERR!'),
		t => display(`${t}°C`) // will read `-9.4452°C`
	);
					
Maybe.of(reading2)
	.map(fahrenheitToCelsius)
	.fork(
		_ => display('ERR!'), // will read `ERR!`
		t => display(`${t}°C`)
	);
```

Note in this use case we're not even assigning the results of the `Maybe` into a `const` value, as in this example we just need to display it.

But if we did need that string value to do something else...

```js
const display = a => {
	console.log(a);
	return a;
};

const fahrenheitToCelsius = a => (a - 32) * 0.5556;

const reading1 = 15;

const temp3C = Maybe.of(reading1)
	.map(fahrenheitToCelsius)
	.fork(
		_ => display('ERR!'),
		t => display(`${t}°C`)
	);
	
console.log(temp3C)
// > "-9.4452°C"
```

This should be enough to get you started on using `Maybe`. It's a very different way of thinking about values than one is usually taught in JS, and will likely take some time to fully grasp.

What helps a lot with understanding the use of monads is practice! On your next small project, try adding in a `Maybe` module (suggestion below), or write your own. Given enough time, you might not be able to imagine writing code in JS without it!

For now, you can give `Maybe` a spin in the following REPL.

_Try it out: [Maybe Monad Example REPL](https://repl.it/@rgeraldporter/Maybe-Monad-Example)_

## Quick review

What has helped me the most over the years is to think of monads as a _container_. That may help you, or to fall back to the dictionary defintion of _single unit_ may also be of help.

Much like a bank ledger, monads keep their values immutible but allow methods to apply functions atop them to generate new monads, and thus new values.

But do be aware, doing a web search to find solutions on monad problems you might encounter may be a bit challenging. A lot of documentation out there is deeply saturated with technical language you might not be familiar with. A lot of it even I'm not familiar with. Hopefully that will change as this powerful pattern is adopted more widely.

## Monad modules you can use right now

My own module, which is not very different from what has been demonstrated in this introduction is available as [simple-maybe on npm](https://www.npmjs.com/package/simple-maybe).

## What next?

Once you have grasped completely the concepts outlined in this introduction, other monads will mostly be just slight variations on the types of monad shown here.

In the near future I'll be posting about some other monad modules I've been building, and how they are used, and constructed.<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />

_Want to comment? This is also posted at [dev.to](https://dev.to/rgeraldporter/building-expressive-monads-in-javascript-introduction-23b)._
