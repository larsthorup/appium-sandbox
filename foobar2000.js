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
    // dumpsys window windows | grep -E 'Window #'
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
  const { ELEMENT: nextButton1 } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  client.setImplicitTimeout(1000);

  // click next button 1
  await client.elementClick(nextButton1);

  // click next button 2
  const { ELEMENT: nextButton2 } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  await client.elementClick(nextButton2);

  // wait for music to scan
  await new Promise((resolve) => setTimeout(resolve, 20000));

  // click next button 3
  const { ELEMENT: nextButton3 } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='NEXT >>']"
  );
  await client.elementClick(nextButton3);

  // click finish button
  const { ELEMENT: finishButton } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='FINISH >>']"
  );
  await client.elementClick(finishButton);

  // click search button
  const { ELEMENT: searchButton } = await client.findElement(
    'accessibility id',
    'Search'
  );
  await client.elementClick(searchButton);

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
