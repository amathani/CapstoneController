// Handles all of the payment infrastructure

var express = require('express');
var router = express.Router();
var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "5h286kmhqjt2g3ty",
  publicKey: "ybbx43n56rx42n23",
  privateKey: "7aa303d8dfa7ccc5ff6295aa6929fe2a"
});

router.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    var clientToken = response.clientToken;
    res.status(400).send(response.clientToken);
  });
});

router.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  // Use payment method nonce here
});

module.exports = router;
