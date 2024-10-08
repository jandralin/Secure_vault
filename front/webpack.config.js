const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: "development",
	entry: ["@babel/polyfill", "./src/index.jsx"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[hash].js",
		publicPath: "/",
	},

	devServer: {
		port: 3000,
		historyApiFallback: true,
	},

	resolve: {
    extensions: ['.js', '.jsx'],
  },

	plugins: [
		new HTMLWebpackPlugin({ template: "./index.html" }),
		new CleanWebpackPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"], // Поддержка css-loader для обработки стилей
			},
			{
				test: /\.(jpg|png|jpeg|svg)/,
				use: ["file-loader"],
			},
			{
				test: /\.(js|jsx)$/, // Для обработки .js и .jsx
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
		]
	}
}