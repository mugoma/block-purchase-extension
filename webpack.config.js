const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");
const { library } = require("webpack");

const chromeStoreVersionOutputDir = "block-purchase-extension-chrome-store-version";
module.exports = (env) => {
    const outputDir = env.env === "chrome-store" ? chromeStoreVersionOutputDir : "dist";
    const outputPath = path.resolve(__dirname, outputDir);
    return [
        {
            name: "background",
            entry: "./src/scripts/background/background.ts",
            target: "webworker", // Uses CommonJS
            output: {
                path: path.resolve(outputPath, "scripts/background"),
                filename: "background.js",
                // libraryTarget: "module",
                library: {
                    type: "umd"
                },
                clean: true
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
            // experiments: {
            //     outputModule: true, // Enables ESM output
            // },
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
                path: path.resolve(outputPath, "scripts/pages"),
                filename: "[name].js", // Dynamically name files based on entry keys
                // libraryTarget: "commonjs2",
                library: {
                    type: "umd"
                },
                clean: true
            },
            // experiments: {
            //     outputModule: true, // Enables ESM output
            // },
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
                path: path.resolve(outputPath, "scripts/content_scripts"),
                filename: "[name].js", // Dynamically name files based on entry keys
                // libraryTarget: "module",
                library: {
                    type: "module"
                },
                clean: true
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
                        {
                            from: path.resolve(__dirname, "src", "pages"),
                            to: path.resolve(outputPath, "pages"),
                            toType: "dir",
                            globOptions: {
                                dot: true,
                                gitignore: true,
                                ignore: ["**/__tests__/**"],
                            },
                        },
                        {
                            from: path.resolve(__dirname, "src", "images", "popup"),
                            to: path.resolve(outputPath, "images", "popup"),
                            toType: "dir"
                        },
                        {
                            from: path.resolve(__dirname, "src", "manifest.json"),
                            to: path.resolve(outputPath, "manifest.json"),
                            toType: "file"
                        },
                        {
                            from: path.resolve(__dirname, "src", "styles"),
                            to: path.resolve(outputPath, "styles"),
                            toType: "dir"
                        },
                        {
                            from: path.resolve(__dirname, "src", "scripts", "bootstrap", "bootstrap.min.js"),
                            to: path.resolve(outputPath, "scripts", "bootstrap", "bootstrap.min.js"),
                            toType: "file"
                        },
                    ],
                }),
            ],
        }
    ];
}