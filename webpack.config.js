const path = require('path');

module.exports = {
    mode: 'development', // "production" | "development" | "none"
    entry: './src/index.ts',

    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js"
    },

    module: {
        rules: [{
            // *.ts
            test: /\.ts$/,
            // Compilar TypeScript 
            use: 'ts-loader'
        }]
    },
    // all import *.ts
    resolve: {
        modules: [
        "node_modules", // node_modules
        ],
        extensions: [
        '.ts',
        '.js' // requerido para cargar bibliotecas del node_modules
        ]
    }
};
