const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: glob.sync("./src/**/*.ts").reduce(function(obj, el){
        obj[path.parse(el).name] = el;
        return obj;
    }, {}),
    output: {
        filename: "[name].js",
        path: path.resolve((__dirname, "dist"))
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handle by ts-loader
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "**",
                to: path.resolve(__dirname, "dist"),
                context: path.resolve(__dirname, "src"),
                globOptions: {
                    ignore: ["**/*.ts"]
                },
                force: true
            }]
        })
    ],
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: "all"
        }
    }
}