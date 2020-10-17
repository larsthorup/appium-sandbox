const wdio = require('webdriverio');
const assert = require('assert');
const fs = require('fs');

const deviceName = process.argv[2] || 'Android Simulator';
const query = process.argv[3] || 'deconvolution';

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    platformVersion: '10',
    deviceName,
    // app: "ApiDemos-debug.apk", // From http://appium.io/docs/en/about-appium/getting-started/
    // appPackage: "io.appium.android.apis",
    // appPackage: 'com.android.vending', // Goole Play Store
    // appActivity: 'com.google.android.finsky.activities.MainActivity',
    appPackage: 'com.spotify.music',
    appActivity: 'com.spotify.music.MainActivity',
    automationName: 'UiAutomator2',
  },
};

async function main() {
  const client = await wdio.remote(opts);

  // const field = await client.$("android.widget.EditText");
  // await field.setValue("Hello World!");
  // assert.equal(await field.getText(), "Hello World!");

  // await field.setValue("Hello Lars!");
  // assert.equal(await field.getText(), "Hello Lars!");

  // client.setImplicitTimeout(10000);
  // const searchField = await client.findElement(
  //   'xpath',
  //   "//android.widget.TextView[@text='Search for apps & games']"
  // );
  // client.setImplicitTimeout(1000);

  // wait for app to start
  client.setImplicitTimeout(10000);
  const searchButton = await client.findElement(
    'xpath',
    "//android.widget.ImageView[@content-desc='Search']"
  );
  client.setImplicitTimeout(1000);

  // click search button
  client.touchClick(searchButton);

  // wait for search field
  const searchInput = await client.findElement(
    'xpath',
    "//android.widget.TextView[@content-desc='Search for artists, songs, or podcasts']"
  );

  // type in search field
  await searchInput.setValue(query);

  // press enter
  // client.pressKeyCode()
  // ((AndroidDriver) driver).pressKey(new KeyEvent(AndroidKey.ENTER));

  // TextView[@text="Song • Geodesium"]
  // id: com.spotify.music:id/search_body
  // android.widget.FrameLayout[0]
  // wait for song result
  // click song result

  const screenshot = await client.takeScreenshot();
  fs.writeFileSync('screenshot.png', new Buffer(screenshot, 'base64'));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);
  await client.deleteSession();
}

main().catch(console.error);
