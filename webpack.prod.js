const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/client/index.js',
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    module: {
        rules: [
            {
                test: '/.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
              test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    outputPath: 'fonts/',
                    name: '[name][hash].[ext]',
                  },
                },
              ],
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({filename: '[name].css'}),
        new CopyWebpackPlugin([
            {from:'./src/client/media',to:'media'}
        ]),
        new WorkboxPlugin.GenerateSW()
    ]
}
