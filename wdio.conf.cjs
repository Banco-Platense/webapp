// Usando Appium para pruebas móviles
// Si quiere TS, puede usar ts-node, pero specs son JS

exports.config = {
    runner: 'local',
    specs: ['./e2e/appium/**/*.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:avd': process.env.AVD_NAME || 'Pixel_3_API_30',
        'appium:platformVersion': '11.0',
        browserName: 'Chrome'
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    services: ['appium'],
    appium: {
        command: 'appium'
    },
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}; 