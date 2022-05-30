const path = require('path')
module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].[contenthash:8].js',
        publicPath: ''
    }
}