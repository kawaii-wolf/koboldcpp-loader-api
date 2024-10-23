var express = require("express");
var router = express.Router();
const fs = require('fs');
const config = require('config');
const modeldir = config.get('model.folder');
const modeltype = config.get('model.types');

/**
 * @swagger
 * /kobold-api/list:
 *  get:
 *      summary: Returns listing of available models.
 *      responses:
 *          200:
 *              description: array of strings containing available model names 
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
    console.log(`Listing Models: ${reply}`)
});

module.exports = router;