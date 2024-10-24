const fs = require('fs');
const express = require("express");
var router = express.Router();
const config = require('config');
const modeldir = config.get('model.folder');
const kobold = config.get('kobold.exec');
const secret = config.get('server.secret');
const bodyParser = require('body-parser');
router.use(bodyParser.json({ extended: true }));
const { exec } = require("child_process");

/**
 * @swagger
 * /kobold-api/load:
 *  post:
 *    summary: Load a LLM
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          required:
 *            - model
 *            - context
 *            - apikey
 *          properties:
 *            model:
 *              description: model name
 *              type: string
 *              default: model.gguf
 *            context:
 *              description: number * 1k context size
 *              type: int
 *              default: 32
 *            apikey:
 *              description: shared secret in confing/default.json
 *              type: string
 *        required: true
 *        description: Request Body
 *    responses:
 *      200:
 *        description: model loading
 *      400:
 *        description: request parsing error (bad request)
 *      401:
 *        description: incorrect apikey. Must match config/default.json server.secret
 *      404:
 *        description: model not found
 */
router.post("/", function(req, res, next) {
    if (!req.body.apikey || req.body.apikey != secret)
    {
        res.status(401).send(req.body);
        console.log(`Error Loading Model: invalid API key`);
        return;
    }
    if (!req.body.model || !req.body.context)
    {
        res.status(400).send(req.body);
        console.log(`Error Loading Model: missing parameters`);
        return;
    }
    let files = fs.readdirSync(modeldir);
    if (!files.includes(req.body.model))
    {    
        res.status(404).send(req.body);
        console.log(`Error Loading Model: no model ${req.body.model}`);
        return;
    }

    let cmd = `${kobold} ${req.body.context} ${req.body.model}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            res.status(400).send(error.message);
            console.log(`Error Loading Model: ${error.message}`);
            return;
        }
        if (stderr) {
            res.status(400).send(stderr);
            console.log(`Error Loading Model: ${stderr}`);
            return;
        }
        console.log(`Loading model (${cmd}): ${stdout.trim()}`);
    });

    res.send(req.body);
});

router.use((err, req, res, next) => {
    console.log(`Error Loading Model: ${err}`);
    res.status(400).send(err)
});

module.exports = router;