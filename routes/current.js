var express = require("express");
var router = express.Router();
const fs = require('fs');
const config = require('config');
const backend = config.get('kobold.backend');

/**
 * @swagger
 * /current:
 *  get:
 *      summary: Show the currently loaded model.
 *      responses:
 *          200:
 *              description: Json list of available models
 */
router.get("/", function(req, res, next) {
    fetch(backend)
        .then(reply => reply.json())
        .then(data => {
            res.send([data.data[0].id]);
        })
        .catch(err => {
            res.send([""]);
        });
    }
);

module.exports = router;