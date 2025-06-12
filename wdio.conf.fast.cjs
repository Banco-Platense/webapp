exports.config = {
    runner: 'local',
    hostname: 'localhost',
    port: 4723,
    path: '/',
    specs: ['./e2e/appium/**/*.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:udid': 'emulator-5554',
        'appium:deviceName': 'Appium_Test_Device',
        'appium:platformVersion': '13.0',
        browserName: 'Chrome',
        'appium:chromedriverAutodownload': true,
        'goog:chromeOptions': {
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
        }
    }],
    logLevel: 'warn',
    bail: 0,
    baseUrl: 'http://10.0.2.2:3000',
    waitforTimeout: 5000,
    services: [],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 30000
    },
    
    before: function (capabilities, specs) {
        browser.setTimeout({ 'implicit': 3000 });
    }
};
