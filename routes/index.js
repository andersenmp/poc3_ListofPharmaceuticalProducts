var express = require('express');
var router = express.Router();
var CASAuthentication = require('cas-authentication');


// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url         : 'https://webgate.ec.europa.eu/cas',
    service_url     : 'http://127.0.0.1:8000',
    cas_version     : '2.0'
});

/* GET home page. */
router.get('/', cas.bounce, function(req, res) {
  res.render('index', { cas_user: req.session[ cas.session_name ] });
});

router.get( '/api/user', cas.block, function ( req, res ) {
    res.json( { cas_user: req.session[ cas.session_name ] } );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
router.get( '/authenticate', cas.bounce_redirect );

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
router.get( '/logout', cas.logout );

module.exports = router;
