// Usando Appium para pruebas móviles
// Si quiere TS, puede usar ts-node, pero specs son JS

exports.config = {
    runner: 'local',
    hostname: 'localhost',
    port: 4723,
    path: '/wd/hub',
    specs: ['./e2e/appium/**/*.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:udid': 'emulator-5554',
        'appium:deviceName': 'Medium Phone API 35',
        'appium:platformVersion': '13.0',
        browserName: 'Chrome'
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://10.0.2.2:3000',
    waitforTimeout: 10000,
    services: [],  // no se arranca Appium localmente
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}; 