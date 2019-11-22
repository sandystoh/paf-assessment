// put on base level
module.exports = [
    {
        context: ['/api'],
        target: 'http://localhost:3000',
        secure: false,
        logLevel: 'debug'
    }
]

// package.json scripts: "start-proxy": "ng serve --proxy-config proxy.conf.js",
// run with npm run start-proxy
// now able to put api as '/api/route'