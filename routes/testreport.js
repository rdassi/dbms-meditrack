const express = require('express');
const router = express.Router();
const { db } = require('../db')
const auth = require('./middleware/auth');
const {Readable} = require('stream');
const {getBucket} = require('../mongo');

router.get('/view/doctor/:id', auth('doctor'), async function (req, res, next) {

    //Search for patient and then view their TEST REPORTS in a table
    //might need to make this a post request
    //disable upload report button  I
    try {
        const [rows] = await db.query('select tr_id,test_name,file_name,date from testrec where p_id=?', req.params.id);
        res.json({ 'result': rows });
    }
    catch (e) {
        res.status(500).json({ "ok": "false" });
        console.log(e);
    };
});

router.get('/view/patient', auth('patient'), async function (req, res, next) {

    // check patient and then view their TEST REPORTS in a table
    //Keep option to upload a report as well
    try {
        const [rows] = await db.query('select tr_id,test_name,file_name,date from testrec where p_id=?', req.id);
        res.json({ 'result': rows });
    }
    catch (e) {
        res.status(500).json({ "ok": "false" });
        console.log(e);
    }

});


/**
 * File uploading
 * @param {string} id id
 * @param {Buffer} fileBuffer file
 * @returns {Promise<true>}
 */
async function uploader(id, fileBuffer) {
    const bucket = await getBucket();
    return new Promise((resolve, reject) => {
        //convert buffer to readable stream and feed it into the bucket upload stream
        // reject on error otherwise move to the next part
        Readable.from(fileBuffer)
            .pipe(bucket.openUploadStream(id))
            .on('error', error => {
                console.error('W>write error', error);
                reject(error);
            })
            .on('finish', () => {
                resolve(true);
            });
    });
}

/**
 * Downloader
 * @param {string} id File id
 * @returns {Promise<Buffer>}
 */
async function downloader(id) {
    const bucket = await getBucket();
    return new Promise((res, rej) => {
        let data = Buffer.from([]);
        bucket
            .openDownloadStreamByName(id.toString())
            .on('data', d => {
                data = Buffer.concat([data, d]);
            })
            .on('error', e => {
                console.log(e);
                rej(e);
            })
            .on('end', () => {
                res(data);
            });
    });

}


router.get('/download/doctor/:trid',auth('doctor'),async function(req,res,next){
    try{
        const [rows] = await db.query('select * from testrec where tr_id=? ',[req.params.trid]);
        if(rows.length===0) throw new Error('no file');
        const row = rows[0];
        const {tr_id} = row;
        const mongoFileName = tr_id.toString();

        const mybuff = await downloader(mongoFileName);
        res.json({name:row.file_name,data:[...mybuff]});
    }
    catch(e){
        console.log(e);
        res.status(500).json({msg:'error happen'});
    }
})

router.get('/download/patient/:trid',auth('patient'),async function(req,res,next){
    try{
        const [rows] = await db.query('select * from testrec where tr_id=? and p_id=?',[req.params.trid,req.id]);
        if(rows.length===0) throw new Error('no file');
        const row = rows[0];
        const {tr_id} = row;
        const mongoFileName = tr_id.toString();

        const mybuff = await downloader(mongoFileName);
        res.json({name:row.file_name,data:[...mybuff]});
    }
    catch(e){
        console.log(e);
        res.status(500).json({msg:'error happen'});
    }
})

router.post('/upload/patient', auth('patient'), async function (req, res, next) {

    //UPLOAD REPORT HERE
    //input -> sending test_name,filename-> 
    //{test_name,file_name,bufferData}
    try {
        const [rows] = await db.query('insert into testrec( test_name, file_name, date, p_id) values(?,?,NOW(),?)', [req.body.test_name, req.body.file_name, req.id]);
        
        /**
         * @type {string}
         */
        const mongofileName = rows.insertId.toString();

        const myfile = Buffer.from(req.body.bufferData);

        await uploader(mongofileName,myfile);

        res.json({ 'result': rows });
    }
    catch (e) {
        res.status(500).json({ "ok": "false" });
        console.log(e);
    }
});




router.delete('/delete/patient/:tr_id', auth('patient'), async function (req, res, next) {

    //DELETE REPORT HERE
    try {
        const [rows] = await db.query('delete from testrec where tr_id=?', req.params.tr_id);
        res.json({ 'result': rows });
    }
    catch (e) {
        res.status(500).json({ "ok": "false" });
        console.log(e);
    }
});

module.exports = router;