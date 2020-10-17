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
    appPackage: 'com.android.vending', // Goole Play Store
    appActivity: 'com.google.android.finsky.activities.MainActivity',
    automationName: 'UiAutomator2',
  },
};

async function main() {
  const client = await wdio.remote(opts);

  client.setImplicitTimeout(10000);
  const searchField = await client.findElement(
    'xpath',
    "//android.widget.TextView[@text='Search for apps & games']"
  );
  client.setImplicitTimeout(1000);

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync('screenshot.png', new Buffer(screenshot, 'base64'));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);
  await client.deleteSession();
}

main().catch(console.error);
