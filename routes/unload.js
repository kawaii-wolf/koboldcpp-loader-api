const express = require("express");
var router = express.Router();
const config = require('config');
const secret = config.get('server.secret');
const kobold = config.get('kobold.exit');
const { exec } = require("child_process");
const bodyParser = require('body-parser');
router.use(bodyParser.json({ extended: true }));

/**
 * @swagger
 * /kobold-api/unload:
 *  post:
 *    summary: Unload a LLM
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          required:
 *            - apikey
 *          properties:
 *            apikey:
 *              description: shared secret in confing/default.json
 *              type: string
 *        required: true
 *        description: Request Body
  *    responses:
 *      200:
 *        description: model loading
 *      400:
 *        description: error unloading
 *      401:
 *        description: incorrect apikey. Must match config/default.json server.secret
 */
router.post("/", function(req, res, next) {
    if (!req.body.apikey || req.body.apikey != secret)
    {
        res.status(401).send(req.body);
        console.log(`Error Loading Model: invalid API key`);
        return;
    }
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

router.use((err, req, res, next) => {
    console.log(`Error Unloading Model: ${err}`);
    res.status(400).send(err)
});

module.exports = router;