var express = require("express");
var router = express.Router();

/**
 * @swagger
 * /hello:
 *  get:
 *      description: Returns html for the default ExpressJS welcome page.
 *      responses:
 *          200:
 *              description: html content
 */

router.get("/", function(req, res, next) {
    res.send("Hello World");
});

module.exports = router;