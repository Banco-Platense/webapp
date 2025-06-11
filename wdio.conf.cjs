// Usando Appium para pruebas móviles
// Si quiere TS, puede usar ts-node, pero specs son JS

exports.config = {
    // Conexión a servidor Appium remoto (ej. otro PC)
    runner: 'local',
    hostname: 'IP_DEL_OTRO_PC',  // cambia por la IP del equipo remoto
    port: 4723,
    path: '/wd/hub',
    specs: ['./e2e/appium/**/*.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:udid': 'EMULATOR_O_DEVICE_ID', // usa el ID del emulador que corre remótamente
        'appium:deviceName': 'Medium Phone API 35',
        'appium:platformVersion': '13.0',
        browserName: 'Chrome'
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    services: [],  // no se arranca Appium localmente
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}; 