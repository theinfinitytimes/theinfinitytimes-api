# Contributing to theinfinitytimes.com API

Any contribution is welcome. To contribute

1.  Fork the project
2.  Clone it
3.  Code and submit a merge request with your changes
4.  Make sure you follow the style guidelines 
5.  We will review the Merge Request, leave comments, and merge it when ready

## Coding

* Run `npm run build` to build the project.

The build artifacts will be stored in the `dist/server` directory.

## Tests

### Running unit tests

Run `npm run test` to execute the unit tests via [Mocha](https://mochajs.org/).


## Style

1. Only English words allowed within the code

2. Make sure tests run successfully prior to opening a new Merge Request (MR) (If the tests in your MR are failing, the MR will not be accepted)

3. Make sure your commit message summarizes your change in 50 characters or less

4. In your Merge Request make sure you have a detailed explation of your changes. Also try wrapping all lines at 72 characters or less.

5. f the change fixes an issue, leave another blank line after the final paragraph and indicate which issue is fixed in the specific format below.

```
Fix #52
```
6. Also do your best to factor commits appropriately, i.e not too large with unrelated things in the same commit, and not too small with the same small 
change applied N times in N different commits. If there was some accidental reformatting or whitespace changes during the course of your commits, 
please rebase them away before submitting the MR.