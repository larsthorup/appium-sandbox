const wdio = require('webdriverio');
const assert = require('assert');
const fs = require('fs');

const deviceName = process.argv[2] || 'Android Simulator';
const query = process.argv[3] || 'tunguska';

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    platformVersion: '10',
    deviceName,
    appPackage: 'com.foobar2000.foobar2000',
    appActivity: 'com.foobar2000.foobar2000.MainActivity',
    automationName: 'UiAutomator2',
    autoGrantPermissions: 'true',
  },
};

async function main() {
  const client = await wdio.remote(opts);

  // wait for app to start
  client.setImplicitTimeout(10000);
  const nextButton1 = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  client.setImplicitTimeout(1000);

  // click next button 1
  await (await client.$(nextButton1)).click();

  // click next button 2
  const nextButton2 = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  await (await client.$(nextButton2)).click();

  // wait for music to scan
  await new Promise((resolve) => setTimeout(resolve, 20000));

  // click next button 3
  const nextButton3 = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  await (await client.$(nextButton3)).click();

  // click finish button
  const finishButton = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='FINISH >>']"
  );
  await (await client.$(finishButton)).click();

  // click search button
  const searchButton = await client.findElement(
    'xpath',
    "//android.widget.Button[@content-desc='Search']"
  );
  await (await client.$(searchButton)).click();

  // wait for search field
  const searchInput = await client.$('android.widget.EditText');

  // type in search field
  await searchInput.setValue(query);

  // click song result
  const firstResult = (await client.$$('android.widget.TextView'))[2];
  console.log(firstResult);
  firstResult.click();

  // wait for music to start playing
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync('screenshot.png', new Buffer(screenshot, 'base64'));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);

  // wait for music playing
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await client.deleteSession();
}

main().catch(console.error);
