const wdio = require('webdriverio');
const assert = require('assert');
const fs = require('fs');

const deviceName = process.argv[2] || 'Android Simulator';
const query = process.argv[3] || 'Deconvolution';

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    platformVersion: '10',
    deviceName,
    // dumpsys window windows | grep -E 'Window #'
    appPackage: 'com.spotify.music',
    appActivity: 'com.spotify.music.MainActivity',
    automationName: 'UiAutomator2',
  },
};

const config = JSON.parse(fs.readFileSync('spotify-config.json'));

async function main() {
  const client = await wdio.remote(opts);

  // wait for app to start
  client.setImplicitTimeout(10000);
  const { ELEMENT: selectLoginButton } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='Log in']"
  );
  client.setImplicitTimeout(1000);
  if (!selectLoginButton) {
    const pageSource = await client.getPageSource();
    fs.writeFileSync('pagesource.xml', pageSource);
  }

  // click login button
  await client.elementClick(selectLoginButton);

  // enter user name
  const { ELEMENT: usernameInput } = await client.findElement(
    'id',
    'com.spotify.music:id/username_text'
  );
  await client.elementSendKeys(usernameInput, config.email);

  // enter password
  const { ELEMENT: passwordInput } = await client.findElement(
    'id',
    'com.spotify.music:id/password_text'
  );
  await client.elementSendKeys(passwordInput, config.password);

  // click login button
  const { ELEMENT: loginButton } = await client.findElement(
    'xpath',
    "//android.widget.Button[@text='LOG IN']"
  );
  await client.elementClick(loginButton);

  // wait for login
  client.setImplicitTimeout(10000);
  const { ELEMENT: linkAccountDismissButton } = await client.findElement(
    'xpath',
    "//android.widget.TextView[@text='DISMISS']"
  );
  client.setImplicitTimeout(1000);

  // click dismiss button
  await client.elementClick(linkAccountDismissButton);

  // click search button
  const { ELEMENT: searchButton } = await client.findElement(
    'accessibility id',
    'Search'
    // 'xpath',
    // "//android.widget.ImageView[@content-desc='Search']"
  );
  await client.elementClick(searchButton);

  // wait for search field
  const { ELEMENT: searchSongsButton } = await client.findElement(
    'accessibility id',
    'Search for artists, songs, or podcasts'
  );
  await client.elementClick(searchSongsButton);

  // type in search field
  const { ELEMENT: searchInput } = await client.findElement(
    'accessibility id',
    'Search query'
  );
  await client.elementSendKeys(searchInput, query);

  // click first search result
  client.setImplicitTimeout(10000);
  const [{ ELEMENT: songResult }] = await client.findElements(
    'xpath',
    `//android.widget.TextView[@text='${query}']`
  );
  await client.elementClick(songResult);
  client.setImplicitTimeout(1000);

  await new Promise((resolve) => setTimeout(resolve, 10000));
  const pageSource = await client.getPageSource();
  fs.writeFileSync('pagesource.xml', pageSource);

  await new Promise((resolve) => setTimeout(resolve, 60000));

  await client.deleteSession();
}

main().catch(console.error);
