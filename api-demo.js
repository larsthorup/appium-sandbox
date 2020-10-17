const wdio = require('webdriverio');
const assert = require('assert');
const fs = require('fs');

const deviceName = process.argv[2] || 'Android Simulator';

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    platformVersion: '10',
    deviceName,
    app: 'ApiDemos-debug.apk', // From http://appium.io/docs/en/about-appium/getting-started/
    appPackage: 'io.appium.android.apis',
    appActivity: '.view.TextFields',
    automationName: 'UiAutomator2',
  },
};

async function main() {
  const client = await wdio.remote(opts);

  const field = await client.$('android.widget.EditText');
  await field.setValue('Hello World!');
  assert.equal(await field.getText(), 'Hello World!');

  await field.setValue('Hello Lars!');
  assert.equal(await field.getText(), 'Hello Lars!');

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync('screenshot.png', new Buffer(screenshot, 'base64'));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);
  await client.deleteSession();
}

main().catch(console.error);
