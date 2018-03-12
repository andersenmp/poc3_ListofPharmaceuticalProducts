var express = require('express');
var router = express.Router();
var CASAuthentication = require('cas-authentication');


// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url         : 'https://webgate.ec.europa.eu/cas',
    service_url     : 'http://127.0.0.1:8000',
    cas_version     : '2.0'
});


var ListofPharmaceuticalProducts_controller = require('../controllers/ListofPharmaceuticalProductsController');

/* GET home page. */
router.get('/', cas.bounce, ListofPharmaceuticalProducts_controller.index);

router.post('/GetMedicalList', cas.block, ListofPharmaceuticalProducts_controller.getMedicalList);

router.post('/GetMedicalListDoctor', cas.block, ListofPharmaceuticalProducts_controller.getMedicalListDoctor);

router.post('/UpdateMedicalList', cas.block, ListofPharmaceuticalProducts_controller.updateMedicalList);

router.post('/CreateMedicalList', cas.block, ListofPharmaceuticalProducts_controller.createMedicalList);

module.exports = router;
