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
    // dumpsys window windows | grep -E 'Window #'
    appPackage: 'com.android.settings', // Android Settings
    appActivity: 'com.android.settings.homepage.SettingsHomepageActivity',
    automationName: 'UiAutomator2',
  },
};

async function main() {
  const client = await wdio.remote(opts);

  client.setImplicitTimeout(10000);
  const { ELEMENT: connectionsMenuItem } = await client.findElement(
    'xpath',
    "//android.widget.TextView[@text='Connections']"
  );
  client.setImplicitTimeout(5000);
  await client.elementClick(connectionsMenuItem);

  const { ELEMENT: bluetoothMenuItem } = await client.findElement(
    'xpath',
    "//android.widget.TextView[@text='Bluetooth']"
  );
  await client.elementClick(bluetoothMenuItem);

  const { ELEMENT: bluetoothIsOffSwitch } = await client.findElement(
    'xpath',
    "//android.widget.Switch[@text='Bluetooth, Off']"
  );
  if (bluetoothIsOffSwitch) {
    console.log('Bluetooth is disabled');
    console.log('Enabling Bluetooth');
    await client.elementClick(bluetoothIsOffSwitch);
  }

  const { ELEMENT: bluetoothIsOnSwitch } = await client.findElement(
    'xpath',
    "//android.widget.Switch[@text='Bluetooth, On']"
  );
  assert.ok(!!bluetoothIsOnSwitch);
  console.log('Bluetooth is enabled');

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync('screenshot.png', new Buffer(screenshot, 'base64'));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);
  await client.deleteSession();
}

main().catch(console.error);
