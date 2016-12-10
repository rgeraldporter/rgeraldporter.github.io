---
layout: post
title:  "Experimenting with Knex in Node.js Testing Frameworks: Mocha vs Jasmine"
date:   2016-12-09
excerpt: "Challenges encountered using Mock-Knex in unit tests with Node.js"
tag:
- Node.js
- Javascript
- Knex
- Mocha
- Mock-Knex
- TDD
- unit testing
- Restify
- Express
- PostgreSQL
- Programming
comments: false
feature: /assets/img/prog/Tychonian.png
---

Note: There are some assumed knowledges you'll need to have and grasp upon in order to best appreciate the content. These include: Node.js (including some ES6), unit testing, [Restify](https://www.npmjs.com/package/restify){:target="_blank"} (or [Express](http://expressjs.com/){:target="_blank"}), and PostgreSQL (or mySQL).
{: .notice}

One of the trickier parts of unit testing can be mocking out database connections. The ideal unit test involves only testing your own code, not external dependencies. Therefore, you will want to mock out your calls to the database and generate fake responses.

Additionally, managing schema changes to SQL databases can also be challenging. By using [Knex](https://www.npmjs.com/package/knex){:target="_blank"}, managing database schema changes in Node.js is much easier, and completely documented and controlled by code. It is also a great tool for setup & teardown in integration tests, though lacks tools for proper mocking of unit tests. 

This is where [Mock-Knex](https://www.npmjs.com/package/mock-knex){:target="_blank"} comes in -- it can make mocked database calls easy, and integrate with your existing Knex setup easily. The Mock-Knex module provides functions for assertion libraries to use in unit tests. 

However, I discovered upon interrogating unit tests involving the `tracker.on()` observable feature that were written with Mocha and Mock-Knex that it was unnervingly easy to create non-[falsifiable](http://codingismycraft.com/index.php/2016/05/25/falsifiability-and-unit-testing/){:target="_blank"} tests unless very specific and unintuitive patterns were followed.

I did some cursory research (aka Google search) to find good example patterns of the Mock-Knex module being used with Mocha or Jasmine, but it seemed most articles out there about this module were either agnostic or evasive about which test frameworks were being used under-the-hood.

Thus I went forward with an experiment: is there an idea framework or combination of frameworks wherein the Mock-Knex observable `tracker.on()` is fully falsifiable? Does the tracker feature have a flawed implementation, or are there problems in Mocha?

## Testing with Mocha

See the [GitHub repository](https://github.com/rgeraldporter/knex-tdd-experiment){:target="_blank"} for the full code. This article references `src/routes/example/example.spec.js` in four different branches depending on the framework combination being tested. In the interest of brevity only individual tests are posted as examples. For full context you'll need to clone the repository and check out the appropriate branches.
{: .notice}

{% highlight js %}
// Figure #1
// Using: Mocha, Chai (with "should" extension)
// Branch: hypothesis/mocha-chai
it('should not get a invalid thing', () => {

    // overriding the valid default with an invalid ID
    request = {params: {id: 112}};
    
    // track the queries
    tracker.on('query', query => {
        query.method.should.equal('first');
        query.bindings[0].should.equal(112);
        query.response([]);
    });
    
    // note that "next" is a chai.spy() that returns a Promise
    // otherwise assertions inside tracker.on() will be missed by Mocha
    return controller.getThing(request, response, next)
        .then(() => {
            next.should.have.been.called.with(new restify.NotFoundError('Not found'));
        });
});
{% endhighlight %}

This test does two things: verifies that the correct database query was passed into the database handler by the controller, and then verifies that the (fake) empty response from the database becomes a standard "404 Not Found" error.

What's strange about this test is that a passing condition via `tracker.on` results in a 404 error, which Mocha interprets as an assertion failure. Thus this test cannot pass.

```
// Figure #2

  The example controller
    getThing
      ✓ should get a valid thing
      1) should not get a invalid thing
      ✓ should not get a invalid thing
    postThing
      ✓ should return an error if thing is not included
      ✓ should have postgres call the INSERT query
      ✓ should return a 201 code on success


  5 passing (2s)
  1 failing

  1) The example controller getThing should not get a invalid thing:
     NotFoundError: Not found
```

Two things need to happen to make this test pass *and* be falsifiable. First, the `next` function spy needs to be made into a regular empty function, and not return a `Promise`. The effect this has though, is that the assertions on the query itself will no longer be falsifiable. This leads to the second thing that needs to happen: I need to remove all assertion tests within the query tracker.

{% highlight js %}
// Figure #3
// Using: Mocha, Chai (with "should" extension)
// Branch: hypothesis/mocha-chai

it('should not get a invalid thing', () => {
     
    // setting next's spy to no longer return a Promise
    next = chai.spy(() => null);
    
     // overriding the valid default with an invalid ID
    request = {params: {id: 112}};
    
    // just use the tracker to return a specific response from the mock DB
    // don't do any assertion tests here
    tracker.on('query', query => {
        query.response([]);
    });
    
    return controller.getThing(request, response, next)
        .then(() => {
            next.should.have.been.called.with(new restify.NotFoundError('Not found'));
        });
});
{% endhighlight %}

This passes fine, but what if we want to do assertion tests on the SQL queries? For that we'll have to write a second, separate test to specifically target it.

Here's the secondary test:

{% highlight js %}
// Figure #4
// Using: Mocha, Chai (with "should" extension)
// Branch: hypothesis/mocha-chai

// Note that we're passing the "done()" param function into the test
it('should not get a invalid thing', done => {

    // overriding the valid default with an invalid ID
    request = {params: {id: 112}};
    
    // we need try/catch or failures will be without explanation
    tracker.on('query', query => {
        try {
            query.method.should.equal('first');
            query.bindings[0].should.equal(112);
            done();
        }
        catch (err) {
            done(err);
        }
    });
    
    // note: no "return" here as this is not being treated as a Promise now
    // but rather as an async function due to done() being available
    controller.getThing(request, response, next);
});
{% endhighlight %}

While this works, it's a really unweildy way to write a test, and you'd either need to write a custom function to abstract this behaviour, or be very careful to remember to use this pattern each time. Both are bad solutions.

### Why is this necessary?

Mocha has [two ways to deal with asynchronous tests](https://mochajs.org/#asynchronous-code){:target="_blank"}: you either use `done` as a parameter, and call `done()` when your test is complete, or you `return` a Promise in the function.

When you use `done`, you will need to deal with errors by passing them into done, for example, as `done(err)`. For the Mock-Knex tracker query this doesn't work so great as the "errors" are really assertion errors, so you need to separate your passes and failures via `try` and `catch`.

When you return a `Promise`, and you want to spy on `next`, `next` will need to be a Promise itself in order for `tracker.on()` to bubble up assertion errors properly. Unfortunately, other thrown errors within the controller get caught as if they are assertion errors in this pattern.

### Mocha woes

Unfortunately problems with a single test combining assertions for expected failures/errors in addition to listening to query events seems to be endemic in Mocha.

The best solution within the Mocha ecosystem of frameworks that I have found is [Sinon.JS](http://sinonjs.org/){:target="_blank"}.

{% highlight js %}
// Figure #5
// Using: Mocha, Sinon
// Branch: hypothesis/mocha-sinon
it('should not get a invalid thing', () => {

    // With sinon it appears to be fine to have next() not return a Promise
    // but only because of a quirky bug of sorts...
    next = sinon.spy(() => null);
    
    // overriding the valid default with an invalid ID
    request = {params: {id: 112}};
    
    // Note that we're using the Node.js built-in `assert` library
    tracker.on('query', query => {
        assert.equal(query.method, 'first');
        assert.equal(query.bindings[0], 112);
        query.response([]);
    });
    
    return controller.getThing(request, response, next)
        .then(() => {
            assert(next.withArgs(new restify.NotFoundError('Not found')).called);
        });
});
{% endhighlight %}

With this pattern, tests work correctly in that you can pass and fail tests, however failures will be sorely lacking details in some cases. Any failure made in `tracker.on()` will bubble up as a vague `false === true` failure.

```
// Figure #6

  The example controller
    getThing
      ✓ should get a valid thing (39ms)
      1) should not get a invalid thing
    postThing
      ✓ should return an error if thing is not included
      ✓ should have postgres call the INSERT query
      ✓ should return a 201 code on success


  4 passing (1s)
  1 failing

  1) The example controller getThing should not get a invalid thing:

      AssertionError: false == true
      + expected - actual

      -false
      +true
```

Yes, this does capture failures so the test is correctly falsifiable, but any test failures would need to be followed up with investigations about what exactly failed. It certainly isn't ideal, and feels more like this is functioning this way not by design, but by a quirky bug at best.

## One more try with Mocha

For my last test with Mocha, I substituted in TestDouble as the library of choice for spies and mocks. It [strongly bills itself as an alternative to Sinon](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html){:target="_blank"} and has a very attractive simplicity to its API.

Unfortunately my experimenting revealed it had the exact same problem as Sinon, plus also created even more problems with the `tracker.on()` assertions, where every test that had assertions occur in the tracker before reaching the TestDouble `td.verify()` call caused the verify function to lay claim to the previous failures.

{% highlight js %}
// Figure #7
// Using: Mocha, TestDouble
// Branch: hypothesis/mocha-testdouble
it('should get a valid thing', () => {

    tracker.on('query', query => {
        assert.equal(query.method, 'first');
        // this next one is 111, so will throw assertion failure
        assert.equal(query.bindings[0], 110); 
        query.response({value: 'some data'});
    });
    
    return controller.getThing(request, response, next)
        .then(() => {
            td.verify(response.send(200, {value: 'some data'}));
        });
});
{% endhighlight %}
In this example, I've intentionally made the `assert.equal()` fail a test where it checks if the value is `110` (it's really `111`). But the result is not good.

```
// Figure #8

  The example controller
    getThing
      1) should get a valid thing
      ✓ should not get a invalid thing
    postThing
      ✓ should return an error if thing is not included
      - should have postgres call the INSERT query
      ✓ should have postgres call the INSERT query
      ✓ should return a 201 code on success


  4 passing (1s)
  1 pending
  1 failing

  1) The example controller getThing should get a valid thing:
     Error: Unsatisfied verification on test double.

  Wanted:
    - called with `(200, {value: "some data"})`.

  But there were no invocations of the test double.
```

In short, since something failed before TestDouble could try its verify, it complains that it never got the invocation and that complaint seems to supercede any assertion failures from within the tracker. Technically this test is still falsifiable, but the message explaining the source of the failure is quite misleading.

## Working with Jasmine

Jasmine, while very similar, has some significant differences to Mocha. The key difference for the purposes of this experiment is that it does not require other libraries to fill in features such as spies and mocks -- these come built in.

It also, thankfully, has no problems with handling my tracker code!

{% highlight js %}
// Figure #9
// Using: Jasmine
// Branch: hypothesis/jasmine
it('should not get a invalid thing', done => {

    // use a Jasmine spy for next
    next = jasmine.createSpy();

    // overriding the valid default with an invalid ID
    request = {params: {id: 112}};

    tracker.on('query', query => {
        expect(query.method).toEqual('first');
        expect(query.bindings[0]).toEqual(112);
        query.response([]);
    });

    controller.getThing(request, response, next)
        .then(() => {
            expect(next).toHaveBeenCalledWith(new restify.NotFoundError('Not found'));
            done();
        });
});
{% endhighlight %}
It passes. But can it fail? If I take `expect(query.bindings[0]).toEqual(112);` and change the value to, say, `111`, let's see what happens...

```
// Figure #10

Started
.F..

Failures:
1) The example controller getThing should not get a invalid thing
  Message:
    Expected 112 to equal 111.
```

OK! Now, what is the test we have on `next()` doesn't pass? Let's change `expect(next).toHaveBeenCalledWith(new restify.NotFoundError('Not found'));` to expect a `BadRequestError` error instead.

```
// Figure #11

Started
.F..

Failures:
1) The example controller getThing should not get a invalid thing
  Message:
    Expected spy unknown to have been called with [ BadRequestError: Bad request! ] but actual calls were [ NotFoundError: Not found ].
```

Again, full marks. We not only have a properly falsifiable test, but failures give meaningful data on what actually failed.

## Conclusions

Clearly there are problems with the combination of Mocha and Mock-Knex under specific circumstances. These issues generally centre around the mixture of testing error conditions and tracking queries, specifically.

I don't think it would be fair here to lay blame on either of the libraries dicussed here, as both are quite robust and capable tools, it just seems that under some circumstances, they currently do not play well together. There does appear to be work-arounds, though they are far from ideal. I'll continue to experiment to see if there can perhaps be a fix made in Mock-Knex to account for this behaviour.

What does appear certain is that Mock-Knex and Jasmine work together very well. So far in my testing I have seen no issues with missing failures or inability to pass tests. It is not as pretty of an API as something like TestDouble, and the resulting output is also rather basic, but in the end nothing beats a tool that does what it's supposed to do.<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />