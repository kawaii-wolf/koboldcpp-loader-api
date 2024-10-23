const express = require("express");
var router = express.Router();
const config = require('config');
const kobold = config.get('kobold.exit');
const { exec } = require("child_process");

/**
 * @swagger
 * /kobold-api/unload:
 *  post:
 *    summary: Unload a LLM
 *    consumes:
 *      - application/json
 *    responses:
 *      200:
 *        description: model loading
 *      400:
 *        description: error unloading
 */
router.post("/", function(req, res, next) {

    let cmd = `${kobold}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            res.status(400).send(error.message);
            console.log(`Error Unloading Model: ${error.message}`);
            return;
        }
        if (stderr) {
            res.status(400).send(stderr);
            console.log(`Error Unloading Model: ${stderr}`);
            return;
        }
        console.log(`Unloading model (${cmd}): ${stdout.trim()}`);
    });

    res.send();
});

module.exports = router;