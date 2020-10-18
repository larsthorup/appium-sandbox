# appium-sandbox

Prerequisites

http://appium.io/docs/en/drivers/android-uiautomator2/#real-device-setup

```
npm install
npm run doctor
adb devices
cp sample-spotify-config.json spotify-config.json # and edit it
```

Terminal 1

```
npm run appium
```

Terminal 2

```
node api-demo (deviceId)
node google-play-store (deviceId)
node foobar2000 (deviceId) (query)
node spotify (deviceId) (query)
node bluetooth (devicdId)
```
