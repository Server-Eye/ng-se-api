module.exports = {
    bundle: {
        'ng-se-api.min': {
            scripts: [
                './node_modules/stjs/st.js',
                './src/module.js',
                './src/**/*.js'
            ],
            options: {
                rev: false,
                useMin: true,
                uglify: false
            }
        },
        'ng-se-api': {
            scripts: [
                './node_modules/stjs/st.js',
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