var express = require('express');
var router = express.Router();


var ListofPharmaceuticalProducts_controller = require('../controllers/ListofPharmaceuticalProductsController');

/* GET home page. */
router.get('/', ListofPharmaceuticalProducts_controller.index);

router.post('/GetMedicalList', ListofPharmaceuticalProducts_controller.getMedicalList);

router.post('/GetMedicalListDoctor', ListofPharmaceuticalProducts_controller.getMedicalListDoctor);

module.exports = router;
