const fs = require('fs');
const express = require("express");
var router = express.Router();
const config = require('config');
const modeldir = config.get('model.folder');
const kobold = config.get('kobold.exec');
const bodyParser = require('body-parser');
router.use(bodyParser.json({ extended: true }));
const { exec } = require("child_process");

/**
 * @swagger
 * /load:
 *  post:
 *    summary: Load a LLM
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: model
 *        schema:
 *          type: object
 *          required:
 *            - model
 *            - context
 *          properties:
 *            model:
 *              description: model name
 *              type: string
 *              default: model.gguf
 *            context:
 *              description: number * 1k context size
 *              type: int
 *              default: 32
 *        required: true
 *        description: model to load. See /list
 *    responses:
 *      200:
 *        description: model loading
 *      400:
 *        description: request parsing error (bad request)
 *      404:
 *        description: model not found
 */
router.post("/", function(req, res, next) {
    if (!req.body.model || !req.body.context)
    {
        res.status(400).send(req.body);
        return;
    }
    let files = fs.readdirSync(modeldir);
    if (!files.includes(req.body.model))
    {    
        res.status(404).send(req.body);
        return;
    }
    if (!(req.body.context === parseInt(req.body.context,10)) || req.body.context <= 0)
    {
        res.status(400).send(req.body);
        return;
    }

    let cmd = `${kobold} ${req.body.context} ${req.body.model}`;
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            res.status(400).send(error.message);
            return;
        }
        if (stderr) {
            res.status(400).send(stderr);
            return;
        }
    });

    res.send(req.body);
});

router.use((err, req, res, next) => {
    res.status(400).send(err)
});

module.exports = router;