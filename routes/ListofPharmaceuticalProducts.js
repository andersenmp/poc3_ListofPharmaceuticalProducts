var express = require('express');
var router = express.Router();
var CASAuthentication = require('cas-authentication');
var SentryUtils = require('../Library/SentryUtils')

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url         : 'https://webgate.ec.europa.eu/cas',
    service_url     : 'http://192.168.1.44:8000',
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
