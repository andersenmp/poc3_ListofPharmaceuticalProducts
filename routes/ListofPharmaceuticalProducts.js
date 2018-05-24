var express = require('express');
var router = express.Router();
var CASAuthentication = require('cas-authentication');
var SentryUtils = require('../Library/SentryUtils')

var os = require('os');
var ifaces = os.networkInterfaces();
var ecasService_url;

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



function hasAccessToFeature(feature){
    return function (req, res, next) {
        var sentry = new SentryUtils(req.session.cas_user)
        sentry.hasAccessToFeature(feature).then(function(access) {
            if(!access){
                return res.status(403).send("Access Denied");
            }
        })
        next();
    }
}


var ListofPharmaceuticalProducts_controller = require('../controllers/ListofPharmaceuticalProductsController');

/* GET home page. */
router.get('/', cas.bounce, hasAccessToFeature('/ADMINISTRATOR'), ListofPharmaceuticalProducts_controller.index);

router.post('/GetMedicalList', cas.block, hasAccessToFeature('/ADMINISTRATOR'), ListofPharmaceuticalProducts_controller.getMedicalList);

router.post('/GetMedicalListDoctor', cas.block, hasAccessToFeature('/ADMINISTRATOR'), ListofPharmaceuticalProducts_controller.getMedicalListDoctor);

router.post('/UpdateMedicalList', cas.block, hasAccessToFeature('/ADMINISTRATOR'), ListofPharmaceuticalProducts_controller.updateMedicalList);

router.post('/CreateMedicalList', cas.block, hasAccessToFeature('/ADMINISTRATOR'), ListofPharmaceuticalProducts_controller.createMedicalList);

module.exports = router;
