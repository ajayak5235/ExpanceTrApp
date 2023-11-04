
const AWS = require('aws-sdk');
require('dotenv').config()
exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.bucket_name;

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.access_key,
        secretAccessKey: process.env.secret_key
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err)
            } else {
                // console.log(response);
                resolve(response.Location)
            }
        })
    })
}