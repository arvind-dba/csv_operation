const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { getDbReference } = require('./../db');

exports.cSVOperation = async (req, res, next) => {
    let headers = [], isHeader = false;
    const dbPromise = [];
    const collection = req.file.originalname.split('.csv')[0];
    const db = (await getDbReference()).db('asort');
    const lineReader = require('readline').createInterface({
        input: fs.createReadStream(req.file.path)
    });

    lineReader.on('line', line => {
        if (!isHeader) {
            headers = line.split(',');
            isHeader = true;
            return;
        }
        let document = line.split(',').reduce((doc, item, index) => {
            doc[headers[index]] = item;
            return doc;
        }, {});
        dbPromise.push(db.collection(collection).insert(document));
        // process.exit(0);
    });
    lineReader.on('close', async () => {
        Promise
            .all(dbPromise)
            .then(data => {
                res.status(200).json({
                    error: false,
                    message: "CSV Operation Successful",
                    data: data.length
                });
            })
            .catch(err => {
                res.status(200).json({
                    error: true,
                    message: "CSV Operation Failed",
                    data: err
                });
            });
    });
};
