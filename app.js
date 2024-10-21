const fs = require('fs');
const express = require('express');
var path = require("path");
const app = express();
const port = 8000;

var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var swaggerSpecs = swaggerJsdoc({
    swaggerDefinition: {
        info: {
        title: "My API",
        version: "1.0.0",
        description: "My API for doing cool stuff!",
        },
    },
    apis: [path.join(__dirname, "/routes/*.js")],
});

app.listen(port,()=> { console.log('listen port 8000'); });

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