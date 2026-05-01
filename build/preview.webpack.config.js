const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: 'web',
    entry: './src/preview/index.ts',
    output: {
        path: path.resolve(__dirname, '..', 'dist-preview'),
        filename: 'index.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: {
        fs: 'commonjs fs'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader'
            }]
        }, {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, '..', 'src', 'preview', 'skins')
            ],
            use: [{
                loader: 'ts-loader',
                options: {
                    allowTsInNodeModules: true
                }
            }]
        }]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ]
};
