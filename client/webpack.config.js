const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'teamhacker.js',
		path: path.resolve(__dirname, '../src/main/resources/static/js')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	}
};
