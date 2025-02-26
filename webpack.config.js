const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
    {
        name: "background",
        entry: "./src/scripts/background/background.ts",
        target: "web", // Uses CommonJS
        output: {
            path: path.resolve(__dirname, "dist/scripts/background"),
            filename: "background.js",
            libraryTarget: "module",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        experiments: {
            outputModule: true, // Enables ESM output
        },
    },
    {
        name: "User Pages",
        entry: glob.sync("./src/scripts/pages/*.ts").reduce((entries, file) => {
            const name = path.basename(file, ".ts"); // Extract file name without extension
            entries[name] = file;
            return entries;
        }, {}),
        target: "web", // Uses ESM
        output: {
            path: path.resolve(__dirname, "dist/scripts/pages"),
            filename: "[name].js", // Dynamically name files based on entry keys
            libraryTarget: "module",
        },
        experiments: {
            outputModule: true, // Enables ESM output
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
    },
    {
        name: "Content Scripts",
        entry: glob.sync("./src/scripts/content_scripts/*.ts").reduce((entries, file) => {
            const name = path.basename(file, ".ts"); // Extract file name without extension
            entries[name] = file;
            return entries;
        }, {}),
        target: "web", // Uses ESM
        output: {
            path: path.resolve(__dirname, "dist/scripts/content_scripts"),
            filename: "[name].js", // Dynamically name files based on entry keys
            libraryTarget: "module",
        },
        experiments: {
            outputModule: true, // Enables ESM output
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    //   exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
    },
    {
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, "src", "pages"), to: path.resolve(__dirname, "dist", "pages"), toType: "dir" },
                    { from: path.resolve(__dirname, "src", "images", "popup"), to: path.resolve(__dirname, "dist", "images", "popup"), toType: "dir" },
                    { from: path.resolve(__dirname, "src", "manifest.json"), to: path.resolve(__dirname, "dist", "manifest.json"), toType: "file" },
                    { from: path.resolve(__dirname, "src", "styles"), to: path.resolve(__dirname, "dist", "styles"), toType: "dir" },
                    { from: path.resolve(__dirname, "src", "scripts", "bootstrap", "bootstrap.min.js"), to: path.resolve(__dirname, "dist", "scripts", "bootstrap", "bootstrap.min.js"), toType: "file" },
                ],
            }),
        ],
    }
];
