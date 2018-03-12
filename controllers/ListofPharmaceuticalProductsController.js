var  db = require('../models');
var dateFns = require('date-fns');

var medicalList = db.MedicalList;

exports.index = function(req, res) {
    res.render('ListofPharmaceuticalProducts/index', { csrf: req.csrfToken() });
};


exports.getMedicalList = function(req, res) {

    var sortname = req.body['sort[0][field]'] || 'name';

    var sortdir = req.body['sort[0][dir]'] || 'asc';

    if(sortname == 'medicine_name')
        sortname = 'name'

    var items = [];

    var querySet = medicalList.findAll({
        order: [[sortname,sortdir]],
        where: {
            reimbursible: {
                        [db.Op.not]: null,
                        [db.Op.ne]: null,
                        [db.Op.ne]: '',
                        [db.Op.ne]: 'REJECTED'
            }
        }
    })
     .then(rows=>{
            rows.forEach(function(row){
                items.push(
                    {
                        'ID': row.id,
                        'MEDICINE_NAME': row.name,
                        'COMPOSITION': row.composition,
                        'APP_DATE': dateFns.format(row.app_date,'DD/MM/YYYY'),
                        'LINK': row.link,
                        'REIMBURSIBLE': row.reimbursible,
                        'COMMENTS': row.comments,
                        'USAGE': row.usage
                    });
            });

            res.send(
            {
                'total':items.length,
                'results': items
            }
        );
    });

};


exports.getMedicalListDoctor = function(req, res) {

    var sortname = req.body['sort[0][field]'] || 'name';

    var sortdir = req.body['sort[0][dir]'] || 'asc';

    if(sortname == 'medicine_name')
        sortname = 'name'

    var items = [];

    var querySet = medicalList.findAll({
        order: [[sortname,sortdir]],
        where: {
            reimbursible: {
                [db.Op.or]: {
                    [db.Op.eq]: '',
                    [db.Op.eq]: null
                }
            }
        }
    })
        .then(rows=>{
        rows.forEach(function(row){
        items.push(
            {
                'ID': row.id,
                'MEDICINE_NAME': row.name,
                'COMPOSITION': row.composition,
                'APP_DATE': dateFns.format(row.app_date,'DD/MM/YYYY'),
                'LINK': row.link,
                'REIMBURSIBLE': row.reimbursible,
                'COMMENTS': row.comments,
                'USAGE': row.usage
            });
    });

    res.send(
        {
            'total':items.length,
            'results': items
        }
    );
});

};

exports.updateMedicalList = function(req, res) {
    response = {
        'ERROR': false,
        'TEXT': 'success'
    };

    var _id = req.body['ID'] || 0;

    medicalList.findById(_id).then(row => {
        row.update({
            name: req.body['MEDICINE_NAME'] || '',
            composition: req.body['COMPOSITION'] || '',
            link: req.body['LINK'] || '',
            reimbursible: req.body['REIMBURSIBLE'] || '',
            comments: req.body['COMMENTS'] || '',
            usage: req.body['USAGE'] || ''
        }).then(() => {
            res.send(response);
        }).catch(error => {
            console.log(error);
            res.status(500).send({ ERROR: true, TEXT: 'error' })
        });
    });
};

exports.createMedicalList = function(req, res) {
    response = {
        'ERROR': false,
        'TEXT': 'success'
    };

    medicalList.create({
        name: req.body['MEDICINE_NAME'] || '',
        composition: req.body['COMPOSITION'] || '',
        link: req.body['LINK'] || '',
        reimbursible: null,
        comments: req.body['COMMENTS'] || '',
        usage: req.body['USAGE'] || ''
    }).then(() => {
        res.send(response);
    }).catch(error => {
        res.status(500).send({ ERROR: true, TEXT: 'error' })
    });
};

