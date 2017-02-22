---
layout: post
title:  "Chrome Autofill Woes"
date:   2017-02-21
excerpt: "The Google Chrome browser sometimes assumes too much."
tag:
- Javascript
- Google Chrome
- HTML5
- Programming
comments: false
feature: /assets/img/tychoInst.gif
---

There's no doubt that Google Chrome has been an overwhelming net-benefit to an open web. New HTML standards get adopted rather rapidly now, and most browsers now are updated with great frequency due to Google's (and Mozilla's) agressive update schedule... even if [their version numbering makes little sense](http://www.techradar.com/news/internet/version-numbers-have-become-meaningless-1077921){:target="_blank"}.

It is no longer a frequent occurence that you come across heavy-handed decisions made by the browser on behalf of the user and the web designer/programmer. But as I will show, it does still happen.

### The problems

Chrome's autofill, for the most part, follows the [HTML5 autocomplete specifications](https://html.spec.whatwg.org/multipage/forms.html#autofill){:target="_blank"}. One strange exception, however, is that Chrome ignores the `autocomplete="off"`, which means disabling autofill is not something you can do using the W3C standards in Chrome.

Additionally, Chrome also *always* assumes the field preceding a password field is a "username" or "email" field. Many developers have come across this behaviour unexpectedly, especially in forms designed for editing a user, or user registration where there are fields such as "address", or "phone number".

So how does one get around not being able to use `autocomplete="off"`, and how can you disable Chrome's strange assumptions about form fields based on their order of placement?

<figure>
  <a href="/assets/img/chrome-autofill.png"><img src="/assets/img/chrome-autofill.png"></a>
  <figcaption>Chrome, autofilling an email in where a phone number should be.</figcaption>
</figure>

### Solution

The basic solution to this is to use either `autocomplete="new-something"` (where "something" is anything you want, really) in the input tag for the field preceding the password field, or to use one of the supported autofill types in the HTML5 spec. This will override's Chrome's decision. It may also help to, in the case of a registration or user-edit form, add `autocomplete="new-password"` to the password field itself as well.

For example, if the field preciding the password field is a phone number, you could add `autocomplete="tel"` and this will override its logic that would normally decide to fill in your email (or username) here, and instead place an autofilled phone number in.

You could also opt to make up an autocomplete value. Strangely, anything will work *except* for `off` or `false` as values. I suggest using something prepended with `new-` followed by some descriptive name for the type in the element, only so that future developers who come across your code can surmise your intention here. A random string of nonsense would work too, but could be confusing to the next person who works with your code.<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />

* You can also see my [Stack Overflow answer here](http://stackoverflow.com/questions/23156578/google-chrome-autofilling-all-password-inputs/42092701#42092701){:target="_blank"}.