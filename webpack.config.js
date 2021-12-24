const path = require('path');

module.exports = {
  entry: './src/entry-point.ts',
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader'
      },
    ],
  },
  optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'cards.lib.js',
    library:"cards",
    libraryTarget: "umd",
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
  },
};
