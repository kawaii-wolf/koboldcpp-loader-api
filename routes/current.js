var express = require("express");
var router = express.Router();
const fs = require('fs');
const config = require('config');
const backend = config.get('kobold.backend');

/**
 * @swagger
 * /current:
 *  get:
 *    summary: Show the currently loaded model.
 *    responses:
 *      200:
 *        description: Currently loaded Model(s)
 *      400:
 *        description: No model loaded or koboldcpp error
 */
router.get("/", function(req, res, next) {
    fetch(backend)
        .then(reply => reply.json())
        .then(data => {
            res.send([data.data[0].id]);
            console.log(`Listing current model: ${data.data[0].id}`);
        })
        .catch(err => {
            console.log(`Error listing current model: ${err}`);
            res.send([err]);
        });
    }
);

module.exports = router;