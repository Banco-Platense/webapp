// Nota: eliminado import type de '@wdio/types' para evitar errores de TS

export const config = {
    runner: 'local',
    specs: ['./e2e/appium/**/*.ts'],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        browserName: 'Chrome',
        'appium:deviceName': 'Android Emulator',
        'appium:platformVersion': '11.0'
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json'
        }
    }
}; 