module.exports = {module.exports = {

  default: {  default: {

    // Feature files location    // Feature files location

    features: [    features: [

      'out/api/**/*.feature',      'out/api/**/*.feature',

      'out/ui/**/*.feature'      'out/ui/**/*.feature'

    ],    ],

        

    // Step definitions location    // Step definitions location

    require: [    require: [

      'test-support/**/*.ts',      'test-support/**/*.ts',

      'out/api/**/*.ts',      'out/api/**/*.ts',

      'out/ui/**/*.ts'      'out/ui/**/*.ts'

    ],    ],

        

    // Format options    // Format options

    format: [    format: [

      'progress-bar',      'progress-bar',

      'json:reports/cucumber-report.json',      'json:reports/cucumber-report.json',

      'html:reports/cucumber-report.html',      'html:reports/cucumber-report.html',

      '@cucumber/pretty-formatter'      '@cucumber/pretty-formatter'

    ],    ],

        

    // Require TypeScript support for ES modules    // Require TypeScript support for ES modules

    requireModule: ['ts-node/esm'],    requireModule: ['ts-node/esm'],

        

    // World parameters for Playwright    // World parameters for Playwright

    worldParameters: {    worldParameters: {

      playwright: {      playwright: {

        headless: true,        headless: true,

        baseURL: process.env.BASE_URL || 'https://api.weatherapi.com'        baseURL: process.env.BASE_URL || 'https://api.weatherapi.com'

      }      }

    },    },

        

    // Tags to control test execution    // Tags to control test execution

    tags: process.env.CUCUMBER_TAGS || '@smoke or @regression',    tags: process.env.CUCUMBER_TAGS || '@smoke or @regression',

        

    // Retry failed scenarios    // Retry failed scenarios

    retry: 1,    retry: 1,

        

    // Parallel execution    // Parallel execution

    parallel: 2,    parallel: 2,

        

    // Timeout for steps (30 seconds)    // Timeout for steps (30 seconds)

    timeout: 30000    timeout: 30000

  },  },

    

  // Profile for API tests only  // Profile for API tests only

  api: {  api: {

    features: ['out/api/**/*.feature'],    features: ['out/api/**/*.feature'],

    require: ['test-support/**/*.ts', 'out/api/**/*.ts'],    require: ['test-support/**/*.ts', 'out/api/**/*.ts'],

    format: [    format: [

      'progress-bar',      'progress-bar',

      'json:reports/api-cucumber-report.json',      'json:reports/api-cucumber-report.json',

      'html:reports/api-cucumber-report.html'      'html:reports/api-cucumber-report.html'

    ],    ],

    requireModule: ['ts-node/esm'],    requireModule: ['tsx/esm'],

    worldParameters: {    worldParameters: {

      playwright: {      playwright: {

        headless: true,        headless: true,

        baseURL: 'https://api.weatherapi.com'        baseURL: 'https://api.weatherapi.com'

      }      }

    },    },

    tags: '@smoke or @regression',    tags: '@smoke or @regression',

    retry: 1,    retry: 1,

    parallel: 1, // Reduce parallelism to avoid conflicts    parallel: 2,

    timeout: 30000    timeout: 30000

  },  },

    

  // Profile for UI tests only  // Profile for UI tests only

  ui: {  ui: {

    features: ['out/ui/**/*.feature'],    features: ['out/ui/**/*.feature'],

    require: ['test-support/**/*.ts', 'out/ui/**/*.ts'],    require: ['test-support/**/*.ts', 'out/ui/**/*.ts'],

    format: [    format: [

      'progress-bar',      'progress-bar',

      'json:reports/ui-cucumber-report.json',      'json:reports/ui-cucumber-report.json',

      'html:reports/ui-cucumber-report.html'      'html:reports/ui-cucumber-report.html'

    ],    ],

    requireModule: ['ts-node/esm'],    requireModule: ['tsx/esm'],

    worldParameters: {    worldParameters: {

      playwright: {      playwright: {

        headless: process.env.HEADLESS !== 'false',        headless: process.env.HEADLESS !== 'false',

        baseURL: process.env.BASE_URL || 'http://localhost:3000'        baseURL: process.env.BASE_URL || 'http://localhost:3000'

      }      }

    },    },

    tags: '@smoke or @regression',    tags: '@smoke or @regression',

    retry: 1,    retry: 1,

    parallel: 1,    parallel: 1, // UI tests typically need less parallelism

    timeout: 60000    timeout: 60000 // UI tests may need longer timeout

  },  },

    

  // Profile for smoke tests only  // Profile for smoke tests only

  smoke: {  smoke: {

    features: [    features: [

      'out/api/**/*.feature',      'out/api/**/*.feature',

      'out/ui/**/*.feature'      'out/ui/**/*.feature'

    ],    ],

    require: [    require: [

      'test-support/**/*.ts',      'test-support/**/*.ts',

      'out/api/**/*.ts',      'out/api/**/*.ts',

      'out/ui/**/*.ts'      'out/ui/**/*.ts'

    ],    ],

    format: ['progress-bar', '@cucumber/pretty-formatter'],    format: ['progress-bar', '@cucumber/pretty-formatter'],

    requireModule: ['ts-node/esm'],    requireModule: ['tsx/esm'],

    tags: '@smoke',    tags: '@smoke',

    retry: 0,    retry: 0,

    parallel: 1,    parallel: 1,

    timeout: 30000    timeout: 30000

  }  }

};};