const wdio = require("webdriverio");
const assert = require("assert");

const deviceName = process.argv[2];

const opts = {
  path: "/wd/hub",
  port: 4723,
  capabilities: {
    platformName: "Android",
    platformVersion: "10",
    deviceName,
    app: "ApiDemos-debug.apk", // From http://appium.io/docs/en/about-appium/getting-started/
    appPackage: "io.appium.android.apis",
    appActivity: ".view.TextFields",
    automationName: "UiAutomator2",
  },
};

async function main() {
  const client = await wdio.remote(opts);

  const field = await client.$("android.widget.EditText");
  await field.setValue("Hello World!");
  assert.equal(await field.getText(), "Hello World!");

  await field.setValue("Hello Lars!");
  assert.equal(await field.getText(), "Hello Lars!");

  await client.deleteSession();
}

main().catch(console.error);
