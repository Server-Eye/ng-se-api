module.exports = {
    bundle: {
        'ng-se-api.min': {
            scripts: [
                './src/module.js',
                './src/**/*.js'
            ],
            options: {
                rev: false,
                useMin: true,
                uglify: true
            }
        },
        'ng-se-api': {
            scripts: [
                './src/module.js',
                './src/**/*.js'
            ],
            options: {
                rev: false,
                useMin: false,
                uglify: false
            }
        }
    }
};