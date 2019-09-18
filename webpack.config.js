const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry:{
        "bundlefile":'./src/index.js',
    },
    output:{
        path: path.join(__dirname, '/dist'),  
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer:{
        contentBase: './dist',
        historyApiFallback: true,
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude:/node_modules/,
                use:['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
              template: './src/index.html'  
        })
    ]
};