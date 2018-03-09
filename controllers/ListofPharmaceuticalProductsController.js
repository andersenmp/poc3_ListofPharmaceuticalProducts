var  db = require('../models');
var dateFns = require('date-fns');

var medicalList = db.MedicalList;

exports.index = function(req, res) {
    res.render('ListofPharmaceuticalProducts/index');
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
