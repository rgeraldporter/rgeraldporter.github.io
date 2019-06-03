---
layout: post
title: 'Extracting Test Results from CucumberJs in Jenkins Pipeline Syntax'
date: 2019-06-03
published: true
excerpt: 'Get data out of a Jenkins job.'
tag:
    - Groovy
    - Jenkins
    - Java
    - E2E
    - Cucumber
comments: false
feature: /assets/img/fibonacci.jpg
---

Jenkins can be a powerful system for Continuous Integration (CI) services, allowing automation of complex tasks, such as running an end-to-end (E2E) test suite within a Dockerized environment.

You don't automatically get useful data out of Jenkins jobs, however. Perhaps you want to take results from an E2E run and feed them into Slack, notify a monitor on a service like Datadog when there are test failures. You might also want to use the results to inform the successs/failure report of the Jenkins job itself.

## Assumptions

This guide assumes you're using `cucumber-js` (v5.1.0 as of this writing), and `cucumber-html-reporter` (v5.0.0) in a Jenkins Pipeline job. If you are using another reporter, as long as you have a resulting file with data to extract, you may be able to use this guide with some adjustments.

This was designed around an E2E solution that runs tests entirely in Docker, and concludes by using `docker cp` to copy the resulting HTML report to the Jenkins job workspace.

Our `Jenkinsfile` will be using the Jenkins [Scripted Pipeline Syntax](https://jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline), which is built with Groovy. You won't need to know much about Groovy as it's similar enough to JS for what we're doing. Groovy is a ([sort of](https://stackoverflow.com/questions/4272068/is-groovy-syntax-an-exact-superset-of-java-syntax/4274542)) superset of Java, and we're going to take advantage of that in this method.

## Method

As our method for extraction, we're going to parse the HTML file that results, find the two lines that contain the pass and failure results, then use some light regex matching to hone in on those exact integers.

This may seem a bit awkward, but parsing the raw `cucumber-report.json` file would be far, far more work as we'd have to recalculate the results.

## Implementation

At the top of our `Jenkinsfile` let's declare some variables we'll be using in this script.

```groovy
#!groovy

int e2ePassed = 0
int e2eFailed = 0
int e2eTotal
int e2ePercent

pipeline {
( ... )
```

Somewhere down the line, when our main task of running tests is complete, we'll be generating an artifact from the Cucumber JS HTML report.

I've used comments below to document what each line is responsible for.

```groovy
steps {

    /*
     run test, copy the report file out of docker or where ever it is...
    */

    archiveArtifacts artifacts: "cucumber_report.html", fingerprint: true

    // our Groovy script will be contained in this scope
    script {
        println ('Extracting passed & failed values')

        // get the present working directory (PWD)
        String PWD = pwd()

        // based on this, construct the path to the workspace
        String workspacePath = PWD.substring(PWD.lastIndexOf('/') + 1, PWD.length())

        // read our HTML report into a String
        String report = readFile ("${env.PWD}/workspace/${workspacePath}/cucumber_report.html")

        // split each line break into its own String
        String[] lines = report.split("\n")

        // use regex to find the "passed" line and "failed" line
        def foundPassedLine = lines.find{ line-> line =~ /\<span class="label label-success" title=scenarios\>/ }
        def foundFailedLine = lines.find{ line-> line =~ /\<span class="label label-danger" title=scenarios\>/ }

        // match for the numeric values
        def passedMatch = (foundPassedLine =~ /[0-9]+/)
        def failedMatch = (foundFailedLine =~ /[0-9]+/)

        // cast to Integer so we can work with the number values
        e2ePassed = passedMatch[0] as Integer
        e2eFailed = failedMatch[0] as Integer
        e2eTotal = e2eFailed + e2ePassed
        e2ePercent = e2ePassed / e2eTotal * 100

        if (e2eFailed > 0) {
            // do something extra if there are failures
        }

        // print out our results to the console
        println ("Passed: ${e2ePassed}")
        println ("Failed: ${e2eFailed}")
        println ("Percent passes: ${e2ePercent}%")
    }

    // we can also access these values in an `sh` declaration (or other functions) outside of `script` now
    sh "echo \"Passed: ${e2ePassed}\""
    sh "echo \"Failed: ${e2eFailed}\""
    sh "echo \"Percent passes: ${e2ePercent}%\""

    // you may opt to use the vars in plugins like `slackSend`, etc
}
```

**Note**: The security settings for up-to-date Jenkins setups will trigger an error upon using `readFile` the first time. When this happens, go to `Manage Jenkins` and `In-process Script Approval`. You'll see a prompt to allow the readFile for use in the specific Jenkinsfile in all future job runs. You must be an admin to approve this.

Once you have this data extracted from the reporter, you could use it notify external systems when there are failures, or to keep a running track of test pass/failure metrics.
<img src="http://robporter.ca/assets/img/feather-7.svg" style="width:33px;height:33px;display:inline;padding-left:6px" />
