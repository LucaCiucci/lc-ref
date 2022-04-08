const path = require('path');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  //mode: "production",
  //devtool: "inline-source-map",
  entry: './src/index.ts',
  output: {
    filename: 'lc-ref.js',
    library: 'lc_ref',
    //libraryExport: 'sayHelloWorld',
    /*libraryTarget: 'window',*/
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".css"]
  },
  module: {
    rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" },
        /*{
          test: /\.css$/,
          include: path.join(__dirname, 'src/components'),
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                namedExport: true
              }
            }
          ]
        }*/
        // https://webpack.js.org/loaders/css-loader/
        // https://webpack.js.org/concepts/#loaders
        // https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10
        /*{
          test: /\.css$/i,
          use: [
            "style-loader",
            //'css-modules-typescript-loader',
            //"css-loader"
            {
              loader: "css-loader",
              options: {
                //sourceMap: true
              }
            }
          ],
        },*/
        /**{
          test: /\.css$/,
          use: [
            {
              //loader: "raw-loader"
              loader: "file-loader"
            }
          ]
        },**/
        /*{
          test: /\.css$/,
          use: [
            {
              loader: "css-to-string-loader"
            }
          ]
        },*/
        /*{
          test: /\.css$/,
          use: [
            {
              loader:'typings-for-css-modules-loader',
              options: {
                modules:true,
                namedExport: true,
              }
            }
          ]
        },*/
    ]
  },
  //watch : true,
  plugins: [
    new TypescriptDeclarationPlugin({
      out: "lc-ref.d.ts"
    }),
    /*new CopyPlugin({
      patterns: [
        { from: "./node_modules/katex/dist/fonts", to: "fonts" }
      ],
    }),*/
  ]
};