## Intro
Want to create selenium tests with mocha in TypeScript?

This project will help you to start quickly creating selenium tests on browserstack automate with NodeJS. 
See https://www.browserstack.com/automate/node for the full documentation on this topic. 

## Setup

### For first time, check example
https://github.com/ArkaneNetwork/browserstack-automate-typescript-base-example

### Install
`npm install browserstack-automate-typscript-base`

### Environment variables

#### .env
Check `example.env`, this is your environment file. Rename it to `.env`.

##### Required
* `BROWSERSTACK_USERNAME=your-user-name`
* `BROWSERSTACK_ACCESS_KEY=your-access-key`

The username and access key can be found under "ASSESS KEY" on "https://automate.browserstack.com/" if you're logged in.

##### Optional
* `BROWSERSTACK_LOCAL=true` (default false)
* `BROWSERSTACK_LOCAL_BINARY_PATH=/absolute/path/to/BrowserStackLocal`

#### Other variables
These variables should not be in .env file, but can be set before running a test (as test parameter)
* `BROWSER_CONFIG`: 
  * `IPHONE_8`
  * `MAC_CHROME`
  * `MAC_SAFARI`
  * `WINDOWS10_EDGE`
  * `WINDOWS10_FIREFOX`
* `BROWSERSTACK_BUILD` 
  * This is used to name your BUILD, the name will be shown in the automate browserstack builds overview. If you run multiple tests with the same name in a short periode of time, they will be grouped together.

### Testing local or private url's 
More info: https://www.browserstack.com/local-testing/automate

To enable local testing download the `BrowserStackLocal` for your system here https://www.browserstack.com/local-testing/automate#enable-local-testing-automate

For local testing set these environment parameters
* `BROWSERSTACK_LOCAL=true`
* `BROWSERSTACK_LOCAL_BINARY_PATH=/absolute/path/to/BrowserStackLocal`

This is used when testing on url's that are not public but available for your computer/server that run the tests, fe: http://localhost:8080. 

## Run Test
`npm run test`

# Next Steps
Make custom browser-configs possible
