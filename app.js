const fs = require('fs');
const express = require('express');
var path = require("path");
const app = express();
const config = require('config');
const port = config.get('server.port');
const host = config.get('server.host');

var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var swaggerSpecs = swaggerJsdoc({
    swaggerDefinition: {
        info: {
        title: "KoboldCPP Switch API",
        version: "1.0.0",
        description: "API for loading koboldcpp with models dynamically.",
        },
    },
    apis: [path.join(__dirname, "/routes/*.js")],
});

const server = app.listen(port, host, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server is running on ${host}:${server.address().port}`);
});

fs.readdir(`${__dirname}/routes`, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            if (file.endsWith(".js")) {
                let route = "/" + file.substring(0,file.length-3);
                console.log("Loading Route: " + route);
                app.use(route, require(`${__dirname}/routes` + route));
            }
        })
    }
    console.log("Loading Route: / (Swagger API Documentation)");
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
})

module.exports = app;