const DownloadedFile = require('../Models/download');
const Expense = require('../Models/expense');
const AWS = require('aws-sdk')
const Sequelize = require('sequelize');

async function uploadToS3(data, filename) {
   

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.access_key,
        secretAccessKey: process.env.secret_key,
    })
    var params = {
        Bucket: process.env.bucket_name,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((res, rej) => s3bucket.upload(params, (err, s3response) => {
        if (err) {
            console.log('something went wrong', err)
            rej(err)
        } else {
            console.log('success', s3response)
            res(s3response.Location);

        }
    }))

}



exports.downloading = async (req, res, next) => {
    try {
        const uid = req.id;
        const xpenses = await Expense.findAll({ where: { UserId: uid } })
      
        const stringified = JSON.stringify(xpenses)
        
        const filename = `Expenses${uid}/${new Date()}.txt`;
       

        const fileurl = await uploadToS3(stringified, filename);
      

        const z = await DownloadedFile.create({ url: fileurl, userId: uid, date: new Date() })

       
        console.log(z);
        res.status(200).json({ fileurl, success: true })
    } catch (err) {
        console.log(err);
    }
}
exports.allUrl = (req, res, next) => {

    try {
        const id = req.id;

        DownloadedFile.findAll({ where: { UserId: id } })
            .then(file => {
                // console.log(file)
                res.status(200).json(file)
            }).catch(err => {
                throw new Error(err)
            })

    } catch (err) {
        console.log(err)
    }

}
