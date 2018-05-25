var express = require('express');
var router = express.Router();
var CASAuthentication = require('cas-authentication');


var os = require('os');
var ifaces = os.networkInterfaces();
var ecasService_url = 'http://localhost:8000';

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
            ecasService_url = 'http://' + iface.address + ":8000"
        }
        ++alias;
    });
});




// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url         : 'https://webgate.ec.europa.eu/cas',
    service_url     :  ecasService_url,
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
