var express = require("express");
var router = express.Router();
const fs = require('fs');
const config = require('config');
const modeldir = config.get('model.folder');
const modeltype = config.get('model.types');

/**
 * @swagger
 * /list:
 *  get:
 *      summary: Returns html for the default ExpressJS welcome page.
 *      responses:
 *          200:
 *              description: html content
 */

router.get("/", function(req, res, next) {
    let reply = [];
    let files = fs.readdirSync(modeldir);
    files.forEach(file => {
        modeltype.forEach(ext => {
            if (file.endsWith(ext))
                reply.push(file);
        });
    });
    res.send(reply);
});

module.exports = router;